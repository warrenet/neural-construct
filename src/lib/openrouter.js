const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions'
const DEFAULT_TIMEOUT = 60000 // 60 seconds

// Shared headers helper - eliminates duplication
function getApiHeaders(apiKey) {
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': window.location.origin,
        'X-Title': 'The Neural Construct'
    }
}

// Create AbortController with timeout
function createTimeoutController(timeoutMs = DEFAULT_TIMEOUT) {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs)
    return { controller, timeoutId }
}

export async function streamChat({ apiKey, model, messages, onChunk, onComplete, onError, signal, timeout = DEFAULT_TIMEOUT }) {
    const { controller, timeoutId } = createTimeoutController(timeout)

    // Allow external signal to also abort
    if (signal) {
        signal.addEventListener('abort', () => controller.abort())
    }

    try {
        const response = await fetch(OPENROUTER_API_URL, {
            method: 'POST',
            headers: getApiHeaders(apiKey),
            body: JSON.stringify({
                model,
                messages,
                stream: true
            }),
            signal: controller.signal
        })

        clearTimeout(timeoutId)

        if (!response.ok) {
            const error = await response.json().catch(() => ({ error: { message: `HTTP ${response.status}` } }))
            throw new Error(error.error?.message || `HTTP ${response.status}`)
        }

        const reader = response.body.getReader()
        const decoder = new TextDecoder()
        let fullResponse = ''

        try {
            while (true) {
                const { done, value } = await reader.read()
                if (done) break

                const chunk = decoder.decode(value, { stream: true })
                const lines = chunk.split('\n')

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const data = line.slice(6)
                        if (data === '[DONE]') continue

                        try {
                            const parsed = JSON.parse(data)
                            const content = parsed.choices?.[0]?.delta?.content
                            if (content) {
                                fullResponse += content
                                onChunk(content)
                            }
                        } catch {
                            // Ignore parse errors for incomplete chunks
                        }
                    }
                }
            }
        } finally {
            reader.releaseLock()
        }

        onComplete(fullResponse)
    } catch (err) {
        clearTimeout(timeoutId)

        if (err.name === 'AbortError') {
            console.error('Stream request aborted or timed out')
            onError('Request timed out. Please try again.')
        } else {
            console.error('Stream Error:', err)
            onError(err.message)
        }
    }
}

export async function completeChat({ apiKey, model, messages, signal, timeout = DEFAULT_TIMEOUT }) {
    const { controller, timeoutId } = createTimeoutController(timeout)

    // Allow external signal to also abort
    if (signal) {
        signal.addEventListener('abort', () => controller.abort())
    }

    try {
        const response = await fetch(OPENROUTER_API_URL, {
            method: 'POST',
            headers: getApiHeaders(apiKey),
            body: JSON.stringify({
                model,
                messages,
                stream: false
            }),
            signal: controller.signal
        })

        clearTimeout(timeoutId)

        if (!response.ok) {
            const error = await response.json().catch(() => ({ error: { message: `HTTP ${response.status}` } }))
            throw new Error(error.error?.message || `HTTP ${response.status}`)
        }

        const data = await response.json()
        return data.choices?.[0]?.message?.content || ''
    } catch (err) {
        clearTimeout(timeoutId)

        if (err.name === 'AbortError') {
            console.error('Completion request aborted or timed out')
            throw new Error('Request timed out. Please try again.')
        }

        console.error('Completion Error:', err)
        throw err
    }
}
