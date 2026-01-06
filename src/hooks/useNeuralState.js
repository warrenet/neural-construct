import { useState, useEffect, useCallback } from 'react'
import { get, set } from 'idb-keyval'

const HISTORY_KEY = 'neural-construct-history'
const MAX_HISTORY = 50

export function useNeuralState() {
    const [history, setHistory] = useState([])
    const [loading, setLoading] = useState(true)

    // Load history on mount
    useEffect(() => {
        loadHistory()
    }, [])

    const loadHistory = async () => {
        try {
            const stored = await get(HISTORY_KEY)
            setHistory(stored || [])
        } catch (err) {
            console.error('Failed to load history:', err)
        } finally {
            setLoading(false)
        }
    }

    const saveHistory = async (newHistory) => {
        try {
            await set(HISTORY_KEY, newHistory)
        } catch (err) {
            console.error('Failed to save history:', err)
        }
    }

    const addMessage = useCallback((message) => {
        setHistory(prev => {
            const updated = [...prev, { ...message, id: crypto.randomUUID(), timestamp: new Date().toISOString() }]
            // Keep only last MAX_HISTORY messages
            const trimmed = updated.slice(-MAX_HISTORY)
            saveHistory(trimmed)
            return trimmed
        })
    }, [])

    const updateLastMessage = useCallback((updates) => {
        setHistory(prev => {
            if (prev.length === 0) return prev
            const updated = [...prev]
            updated[updated.length - 1] = { ...updated[updated.length - 1], ...updates }
            saveHistory(updated)
            return updated
        })
    }, [])

    const clearHistory = useCallback(async () => {
        setHistory([])
        await set(HISTORY_KEY, [])
    }, [])

    return {
        history,
        loading,
        addMessage,
        updateLastMessage,
        clearHistory
    }
}

// Session state (not persisted)
export function useSession() {
    const [isStreaming, setIsStreaming] = useState(false)
    const [error, setError] = useState(null)
    const [currentBranches, setCurrentBranches] = useState(null) // For MATRIX mode

    const startStream = () => {
        setIsStreaming(true)
        setError(null)
    }

    const endStream = () => {
        setIsStreaming(false)
    }

    const setStreamError = (err) => {
        setError(err)
        setIsStreaming(false)
    }

    return {
        isStreaming,
        error,
        currentBranches,
        startStream,
        endStream,
        setStreamError,
        setCurrentBranches
    }
}
