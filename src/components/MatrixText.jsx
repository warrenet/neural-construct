import { useState, useEffect } from 'react'
import { useSound } from '../hooks/useSound'

const CHARS = 'ABCDEF0123456789'

export default function MatrixText({ text, active = false }) {
    const [display, setDisplay] = useState('')
    const { playType } = useSound()

    useEffect(() => {
        if (!active) {
            setDisplay(text)
            return
        }

        let i = 0
        const interval = setInterval(() => {
            if (i >= text.length) {
                clearInterval(interval)
                setDisplay(text)
                return
            }

            const revealed = text.slice(0, i)
            const glitch = CHARS[Math.floor(Math.random() * CHARS.length)]
            setDisplay(revealed + glitch)

            // Play sound occasionally
            if (i % 3 === 0) playType()

            i++
        }, 20) // Speed of typing

        return () => clearInterval(interval)
    }, [text, active, playType])

    // If static, just render text
    if (!active) return <>{text}</>

    return <>{display} <span className="typewriter-cursor"></span></>
}
