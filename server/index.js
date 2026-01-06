import express from 'express'
import cors from 'cors'
import process from 'node:process'

const app = express()
const PORT = process.env.PORT || 3001
const REQUEST_TIMEOUT = parseInt(process.env.REQUEST_TIMEOUT) || 60000 // 60s default
const RATE_LIMIT_WINDOW = 60000 // 1 minute
const RATE_LIMIT_MAX = 30 // 30 requests per window

// Allowed origins for CORS
const ALLOWED_ORIGINS = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    process.env.PRODUCTION_ORIGIN
].filter(Boolean)

// Simple in-memory rate limiter
const rateLimitMap = new Map()

function rateLimit(req, res, next) {
    const ip = req.ip || req.connection.remoteAddress || 'unknown'
    const now = Date.now()
    
    if (!rateLimitMap.has(ip)) {
        rateLimitMap.set(ip, { count: 1, windowStart: now })
        return next()
    }
    
    const record = rateLimitMap.get(ip)
    
    // Reset window if expired
    if (now - record.windowStart > RATE_LIMIT_WINDOW) {
        rateLimitMap.set(ip, { count: 1, windowStart: now })
        return next()
    }
    
    // Check if over limit
    if (record.count >= RATE_LIMIT_MAX) {
        return res.status(429).json({ 
            error: 'Rate limit exceeded. Please wait before making more requests.',
            retryAfter: Math.ceil((RATE_LIMIT_WINDOW - (now - record.windowStart)) / 1000)
        })
    }
    
    record.count++
    next()
}

// Clean up old rate limit entries every 5 minutes
setInterval(() => {
    const now = Date.now()
    for (const [ip, record] of rateLimitMap.entries()) {
        if (now - record.windowStart > RATE_LIMIT_WINDOW * 2) {
            rateLimitMap.delete(ip)
        }
    }
}, 300000)

// CORS with origin restriction
app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or Postman)
        if (!origin) return callback(null, true)
        if (ALLOWED_ORIGINS.includes(origin)) {
            return callback(null, true)
        }
        callback(new Error('CORS origin not allowed'))
    },
    credentials: true
}))

app.use(express.json({ limit: '1mb' }))
app.use(rateLimit)

// Get referer from env or default
const getReferer = () => process.env.APP_REFERER || 'http://localhost:5173'

// Shared request headers
const getApiHeaders = (apiKey) => ({
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
    'HTTP-Referer': getReferer(),
    'X-Title': 'The Neural Construct'
})

// Input validation
function validateChatRequest(req, res) {
    const apiKey = req.headers['x-api-key']
    const { model, messages } = req.body

    if (!apiKey || typeof apiKey !== 'string' || apiKey.length < 10) {
        res.status(401).json({ error: 'Valid API key required' })
        return null
    }

    if (!model || typeof model !== 'string') {
        res.status(400).json({ error: 'Valid model ID required' })
        return null
    }

    if (!Array.isArray(messages) || messages.length === 0) {
        res.status(400).json({ error: 'Messages array required' })
        return null
    }

    // Validate each message has role and content
    for (const msg of messages) {
        if (!msg.role || !msg.content) {
            res.status(400).json({ error: 'Each message must have role and content' })
            return null
        }
    }

    return { apiKey, model, messages }
}

// Streaming chat endpoint
app.post('/api/chat', async (req, res) => {
    const validated = validateChatRequest(req, res)
    if (!validated) return

    const { apiKey, model, messages } = validated
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT)

    try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: getApiHeaders(apiKey),
            body: JSON.stringify({ model, messages, stream: true }),
            signal: controller.signal
        })

        clearTimeout(timeout)

        if (!response.ok) {
            const error = await response.json().catch(() => ({}))
            return res.status(response.status).json({ error: error.error?.message || 'OpenRouter error' })
        }

        // Set up SSE headers
        res.setHeader('Content-Type', 'text/event-stream')
        res.setHeader('Cache-Control', 'no-cache')
        res.setHeader('Connection', 'keep-alive')

        // Handle client disconnect
        req.on('close', () => {
            controller.abort()
        })

        // Stream the response
        const reader = response.body.getReader()
        const decoder = new TextDecoder()

        try {
            while (true) {
                const { done, value } = await reader.read()
                if (done) {
                    res.write('data: [DONE]\n\n')
                    break
                }
                const chunk = decoder.decode(value, { stream: true })
                res.write(chunk)
            }
        } finally {
            reader.releaseLock()
        }

        res.end()
    } catch (err) {
        clearTimeout(timeout)
        if (err.name === 'AbortError') {
            console.error('Chat request timed out or aborted')
            if (!res.headersSent) {
                res.status(504).json({ error: 'Request timed out' })
            }
        } else {
            console.error('Chat error:', err)
            if (!res.headersSent) {
                res.status(500).json({ error: err.message })
            }
        }
    }
})

// Non-streaming completion endpoint (for MATRIX parallel branches)
app.post('/api/chat/complete', async (req, res) => {
    const validated = validateChatRequest(req, res)
    if (!validated) return

    const { apiKey, model, messages } = validated
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT)

    try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: getApiHeaders(apiKey),
            body: JSON.stringify({ model, messages, stream: false }),
            signal: controller.signal
        })

        clearTimeout(timeout)

        if (!response.ok) {
            const error = await response.json().catch(() => ({}))
            return res.status(response.status).json({ error: error.error?.message || 'OpenRouter error' })
        }

        const data = await response.json()
        const content = data.choices?.[0]?.message?.content || ''

        res.json({ content })
    } catch (err) {
        clearTimeout(timeout)
        if (err.name === 'AbortError') {
            console.error('Completion request timed out')
            res.status(504).json({ error: 'Request timed out' })
        } else {
            console.error('Completion error:', err)
            res.status(500).json({ error: err.message })
        }
    }
})

// Health check
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        rateLimit: { window: RATE_LIMIT_WINDOW, max: RATE_LIMIT_MAX }
    })
})

app.listen(PORT, () => {
    console.log(`🧠 Neural Construct server running on port ${PORT}`)
    console.log(`   Rate limit: ${RATE_LIMIT_MAX} requests per ${RATE_LIMIT_WINDOW/1000}s`)
    console.log(`   Request timeout: ${REQUEST_TIMEOUT/1000}s`)
})
