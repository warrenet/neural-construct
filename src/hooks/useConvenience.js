import { useState, useCallback } from 'react'

export function useCopyToClipboard() {
    const [copied, setCopied] = useState(false)

    const copy = useCallback(async (text) => {
        try {
            await navigator.clipboard.writeText(text)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
            return true
        } catch (err) {
            console.error('Copy failed:', err)
            return false
        }
    }, [])

    return { copy, copied }
}

export function useExportChat() {
    const exportAsJSON = useCallback((messages, filename = 'chat-export.json') => {
        const data = JSON.stringify(messages, null, 2)
        const blob = new Blob([data], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = filename
        a.click()
        URL.revokeObjectURL(url)
    }, [])

    const exportAsMarkdown = useCallback((messages, filename = 'chat-export.md') => {
        const md = messages.map(m => {
            const role = m.role === 'user' ? '**You**' : `**${m.persona || 'Assistant'}**`
            return `${role}:\n${m.content}\n`
        }).join('\n---\n\n')

        const blob = new Blob([md], { type: 'text/markdown' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = filename
        a.click()
        URL.revokeObjectURL(url)
    }, [])

    return { exportAsJSON, exportAsMarkdown }
}
