import express from 'express'
import cors from 'cors'
import process from 'node:process'

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

// Streaming chat endpoint
app.post('/api/chat', async (req, res) => {
    const apiKey = req.headers['x-api-key']
    const { model, messages } = req.body

    if (!apiKey) {
        return res.status(401).json({ error: 'API key required' })
    }

    if (!model || !messages) {
        return res.status(400).json({ error: 'Model and messages required' })
    }

    try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': 'http://localhost:5173',
                'X-Title': 'The Neural Construct'
            },
            body: JSON.stringify({
                model,
                messages,
                stream: true
            })
        })

        if (!response.ok) {
            const error = await response.json()
            return res.status(response.status).json({ error: error.error?.message || 'OpenRouter error' })
        }

        // Set up SSE headers
        res.setHeader('Content-Type', 'text/event-stream')
        res.setHeader('Cache-Control', 'no-cache')
        res.setHeader('Connection', 'keep-alive')

        // Stream the response
        const reader = response.body.getReader()
        const decoder = new TextDecoder()

        while (true) {
            const { done, value } = await reader.read()
            if (done) {
                res.write('data: [DONE]\n\n')
                break
            }
            const chunk = decoder.decode(value, { stream: true })
            res.write(chunk)
        }

        res.end()
    } catch (err) {
        console.error('Chat error:', err)
        res.status(500).json({ error: err.message })
    }
})

// Non-streaming completion endpoint (for MATRIX parallel branches)
app.post('/api/chat/complete', async (req, res) => {
    const apiKey = req.headers['x-api-key']
    const { model, messages } = req.body

    if (!apiKey) {
        return res.status(401).json({ error: 'API key required' })
    }

    try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': 'http://localhost:5173',
                'X-Title': 'The Neural Construct'
            },
            body: JSON.stringify({
                model,
                messages,
                stream: false
            })
        })

        if (!response.ok) {
            const error = await response.json()
            return res.status(response.status).json({ error: error.error?.message || 'OpenRouter error' })
        }

        const data = await response.json()
        const content = data.choices?.[0]?.message?.content || ''

        res.json({ content })
    } catch (err) {
        console.error('Completion error:', err)
        res.status(500).json({ error: err.message })
    }
})

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.listen(PORT, () => {
    console.log(`🧠 Neural Construct server running on port ${PORT}`)
})
