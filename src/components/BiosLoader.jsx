import { useState, useEffect } from 'react'

const BOOT_LINES = [
    '> CONSTRUCT-01 BIOS v1.0.0',
    '> Initializing Neural Matrix...',
    '> Loading Persona Definitions... OK',
    '> Syncing OpenRouter Uplink...',
    '> Calibrating Reasoning Kernel...',
    '> VAULT STATUS: CHECKING...',
    '> ████████████████████ 100%',
    '> SYSTEM READY'
]

export default function BiosLoader({ onComplete }) {
    const [lines, setLines] = useState([])
    const [complete, setComplete] = useState(false)

    useEffect(() => {
        let index = 0
        const interval = setInterval(() => {
            if (index < BOOT_LINES.length) {
                setLines(prev => [...prev, BOOT_LINES[index]])
                index++
            } else {
                clearInterval(interval)
                setTimeout(() => {
                    setComplete(true)
                    setTimeout(onComplete, 500)
                }, 800)
            }
        }, 200)

        return () => clearInterval(interval)
    }, [onComplete])

    return (
        <div className={`fixed inset-0 bg-[#0a0a0a] z-50 flex items-center justify-center transition-opacity duration-500 ${complete ? 'opacity-0' : 'opacity-100'}`}>
            <div className="w-full max-w-2xl p-8">
                <div className="text-center mb-8">
                    <h1 className="text-2xl text-cyan-400 glow-cyan font-bold tracking-widest">
                        THE NEURAL CONSTRUCT
                    </h1>
                </div>

                <div className="panel p-6 font-mono text-sm space-y-1">
                    {lines.map((line, i) => (
                        <div
                            key={i}
                            className="boot-line text-green-400"
                            style={{ animationDelay: `${i * 0.05}s` }}
                        >
                            {line}
                        </div>
                    ))}
                    {lines.length > 0 && lines.length < BOOT_LINES.length && (
                        <span className="typewriter-cursor"></span>
                    )}
                </div>

                {complete && (
                    <div className="text-center mt-6 text-cyan-400 glow-cyan slide-up">
                        ENTERING CONSTRUCT...
                    </div>
                )}
            </div>
        </div>
    )
}
