import { useState, useEffect, useRef } from 'react'

export default function GlitchText({ text, active = true, className = '' }) {
    const [glitching, setGlitching] = useState(false)
    const activeRef = useRef(active)

    useEffect(() => {
        activeRef.current = active
    }, [active])

    useEffect(() => {
        if (!active) {
            return
        }

        // Random glitch bursts
        const interval = setInterval(() => {
            if (activeRef.current) {
                setGlitching(true)
                setTimeout(() => setGlitching(false), 150)
            }
        }, 2000 + Math.random() * 3000)

        return () => clearInterval(interval)
    }, [active])

    if (!glitching) {
        return <span className={className}>{text}</span>
    }

    return (
        <span
            className={`glitch-text relative inline-block ${className}`}
            data-text={text}
        >
            {text}
        </span>
    )
}

// Loading dots animation
export function LoadingDots({ className = '' }) {
    const [dots, setDots] = useState('')

    useEffect(() => {
        const interval = setInterval(() => {
            setDots(prev => prev.length >= 3 ? '' : prev + '.')
        }, 400)
        return () => clearInterval(interval)
    }, [])

    return (
        <span className={`inline-block w-8 text-left ${className}`}>
            {dots}
        </span>
    )
}

// Streaming text with typewriter effect
export function StreamingText({ text, speed = 20, onComplete }) {
    const [displayed, setDisplayed] = useState('')
    const [complete, setComplete] = useState(false)

    useEffect(() => {
        if (!text) return

        let index = 0
        setDisplayed('')
        setComplete(false)

        const interval = setInterval(() => {
            if (index < text.length) {
                setDisplayed(text.slice(0, index + 1))
                index++
            } else {
                clearInterval(interval)
                setComplete(true)
                onComplete?.()
            }
        }, speed)

        return () => clearInterval(interval)
    }, [text, speed, onComplete])

    return (
        <span>
            {displayed}
            {!complete && <span className="typewriter-cursor"></span>}
        </span>
    )
}
