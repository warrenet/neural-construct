
// Helper for Auto-Titling (Automation)
export async function generateAutoTitle(firstMessage, model, apiKey) {
    if (!apiKey) return null;

    try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': window.location.origin,
            },
            body: JSON.stringify({
                model: model,
                messages: [
                    { role: 'user', content: `Summarize this message into a 3-5 word title (no quotes, no preamble): "${firstMessage}"` }
                ]
            })
        });

        const data = await response.json();
        return data.choices?.[0]?.message?.content?.trim() || null;
    } catch (err) {
        console.error('Auto-Title Failed', err);
        return null;
    }
}
