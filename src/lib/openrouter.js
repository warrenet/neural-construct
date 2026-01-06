import { FREE_MODELS } from './models'

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

// Check if error is rate-limit related
function isRateLimitError(error) {
    const msg = error?.message?.toLowerCase() || ''
    return msg.includes('429') ||
        msg.includes('rate limit') ||
        msg.includes('too many requests') ||
        msg.includes('no endpoints found')
}

// Get next fallback model
function getNextFallbackModel(currentModel) {
    const currentIndex = FREE_MODELS.findIndex(m => m.id === currentModel)
    const nextIndex = (currentIndex + 1) % FREE_MODELS.length
    // Avoid infinite loop - if we've tried all models, return null
    if (nextIndex === 0 && currentIndex !== -1) return null
    return FREE_MODELS[nextIndex]?.id
}

/**
 * Enhanced streamChat with automatic model fallback
 */
export async function streamChat({ apiKey, model, messages, onChunk, onComplete, onError, onFallback, signal, timeout = DEFAULT_TIMEOUT, _attemptedModels = [] }) {
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

        // FALLBACK LOGIC: Try next model on rate limit
        if (isRateLimitError(err) && _attemptedModels.length < FREE_MODELS.length) {
            const nextModel = getNextFallbackModel(model)
            if (nextModel && !_attemptedModels.includes(nextModel)) {
                console.warn(`⚡ Rate limited on ${model}, falling back to ${nextModel}`)

                // Notify UI of fallback (optional callback)
                if (onFallback) {
                    onFallback(model, nextModel)
                }

                // Retry with new model
                return streamChat({
                    apiKey,
                    model: nextModel,
                    messages,
                    onChunk,
                    onComplete,
                    onError,
                    onFallback,
                    signal,
                    timeout,
                    _attemptedModels: [..._attemptedModels, model]
                })
            }
        }

        if (err.name === 'AbortError') {
            console.error('Stream request aborted or timed out')
            onError('Request timed out. Please try again.')
        } else {
            console.error('Stream Error:', err)
            onError(err.message)
        }
    }
}

/**
 * Enhanced completeChat with automatic model fallback
 */
export async function completeChat({ apiKey, model, messages, signal, timeout = DEFAULT_TIMEOUT, _attemptedModels = [] }) {
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

        // FALLBACK LOGIC: Try next model on rate limit
        if (isRateLimitError(err) && _attemptedModels.length < FREE_MODELS.length) {
            const nextModel = getNextFallbackModel(model)
            if (nextModel && !_attemptedModels.includes(nextModel)) {
                console.warn(`⚡ Rate limited on ${model}, falling back to ${nextModel}`)

                return completeChat({
                    apiKey,
                    model: nextModel,
                    messages,
                    signal,
                    timeout,
                    _attemptedModels: [..._attemptedModels, model]
                })
            }
        }

        if (err.name === 'AbortError') {
            console.error('Completion request aborted or timed out')
            throw new Error('Request timed out. Please try again.')
        }

        console.error('Completion Error:', err)
        throw err
    }
}
