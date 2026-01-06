import { useCallback, useRef } from 'react'

// Synthetic Audio Engine for Sci-Fi UI
export function useSound() {
    const audioCtxRef = useRef(null)

    const initAudio = () => {
        if (!audioCtxRef.current) {
            audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)()
        }
        if (audioCtxRef.current.state === 'suspended') {
            audioCtxRef.current.resume()
        }
        return audioCtxRef.current
    }

    const playTone = useCallback((freq, duration, type = 'sine', gainVal = 0.1) => {
        const ctx = initAudio()
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()

        osc.type = type
        osc.frequency.setValueAtTime(freq, ctx.currentTime)

        gain.gain.setValueAtTime(gainVal, ctx.currentTime)
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)

        osc.connect(gain)
        gain.connect(ctx.destination)

        osc.start()
        osc.stop(ctx.currentTime + duration)
    }, [])

    const playHover = useCallback(() => {
        // High pitch short blip
        playTone(2000, 0.05, 'sine', 0.02)
    }, [playTone])

    const playClick = useCallback(() => {
        // Deeper engagement sound
        playTone(800, 0.1, 'square', 0.03)
        setTimeout(() => playTone(1200, 0.15, 'sine', 0.03), 50)
    }, [playTone])



    const playType = useCallback(() => {
        // Tiny typewriter tick
        playTone(3000 + Math.random() * 500, 0.03, 'triangle', 0.01)
    }, [playTone])

    return { playHover, playClick, playType }
}
