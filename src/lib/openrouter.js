// OpenRouter API client

export async function streamChat({ apiKey, model, messages, onChunk, onComplete, onError }) {
    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': apiKey
            },
            body: JSON.stringify({ model, messages })
        })

        if (!response.ok) {
            const error = await response.json()
            throw new Error(error.error || `HTTP ${response.status}`)
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
        onError(err.message)
    }
}

// Non-streaming version for MATRIX mode parallel calls
export async function completeChat({ apiKey, model, messages }) {
    const response = await fetch('/api/chat/complete', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-API-Key': apiKey
        },
        body: JSON.stringify({ model, messages })
    })

    if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || `HTTP ${response.status}`)
    }

    const data = await response.json()
    return data.content
}
