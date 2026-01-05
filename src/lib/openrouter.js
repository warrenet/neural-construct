const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions'

export async function streamChat({ apiKey, model, messages, onChunk, onComplete, onError }) {
    try {
        const response = await fetch(OPENROUTER_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
                'HTTP-Referer': window.location.origin,
                'X-Title': 'The Neural Construct'
            },
            body: JSON.stringify({
                model,
                messages,
                stream: true
            })
        })

        if (!response.ok) {
            const error = await response.json().catch(() => ({ error: { message: `HTTP ${response.status}` } }))
            throw new Error(error.error?.message || `HTTP ${response.status}`)
        }

        const reader = response.body.getReader()
        const decoder = new TextDecoder()
        let fullResponse = ''

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

        onComplete(fullResponse)
    } catch (err) {
        console.error('Stream Error:', err)
        onError(err.message)
    }
}

export async function completeChat({ apiKey, model, messages }) {
    try {
        const response = await fetch(OPENROUTER_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
                'HTTP-Referer': window.location.origin,
                'X-Title': 'The Neural Construct'
            },
            body: JSON.stringify({
                model,
                messages,
                stream: false
            })
        })

        if (!response.ok) {
            const error = await response.json().catch(() => ({ error: { message: `HTTP ${response.status}` } }))
            throw new Error(error.error?.message || `HTTP ${response.status}`)
        }

        const data = await response.json()
        return data.choices?.[0]?.message?.content || ''
    } catch (err) {
        console.error('Completion Error:', err)
        throw err
    }
}
