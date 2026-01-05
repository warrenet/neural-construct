import { useState, useCallback } from 'react'

// Simple visual haptics hook since we don't have audio assets
export function useHaptics() {
    const [shake, setShake] = useState(false)
    const [flash, setFlash] = useState(false)

    const triggerShake = useCallback(() => {
        setShake(true)
        setTimeout(() => setShake(false), 300)
    }, [])

    const triggerFlash = useCallback((color = 'cyan') => {
        setFlash(color)
        setTimeout(() => setFlash(false), 150)
    }, [])

    const triggerError = useCallback(() => {
        setShake(true)
        setFlash('red')
        setTimeout(() => {
            setShake(false)
            setFlash(false)
        }, 300)
    }, [])

    const triggerSuccess = useCallback(() => {
        setFlash('green')
        setTimeout(() => setFlash(false), 300)
    }, [])

    return {
        shake,
        flash,
        triggerShake,
        triggerFlash,
        triggerError,
        triggerSuccess
    }
}
