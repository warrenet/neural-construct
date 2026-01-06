import { useState, useEffect, useRef } from 'react'

// Surprise 1: Neural Activity Monitor (HUD)
export default function NeuralActivity() {
    const canvasRef = useRef(null)
    const [stats, setStats] = useState({ cpu: 0, ram: 0, net: 0 })

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        let frameId

        const history = new Array(60).fill(0)
        let phase = 0

        const render = () => {
            // Update Fake Stats
            const load = Math.random() * 0.3 + 0.3 + (Math.sin(phase) * 0.2) // 30-80% load simulation
            setStats({
                cpu: Math.floor(load * 100),
                ram: 42 + Math.floor(Math.sin(phase * 0.5) * 10),
                net: Math.floor(Math.random() * 500)
            })

            // Update Graph History
            history.shift()
            history.push(load)

            // Draw
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            ctx.strokeStyle = '#00d4ff' // Cyan
            ctx.lineWidth = 1.5
            ctx.beginPath()

            history.forEach((val, i) => {
                const x = i * (canvas.width / 60)
                const y = canvas.height - (val * canvas.height)
                if (i === 0) ctx.moveTo(x, y)
                else ctx.lineTo(x, y)
            })
            ctx.stroke()

            // Fill
            ctx.lineTo(canvas.width, canvas.height)
            ctx.lineTo(0, canvas.height)
            ctx.fillStyle = 'rgba(0, 212, 255, 0.1)'
            ctx.fill()

            phase += 0.05
            frameId = requestAnimationFrame(render)
        }

        render()
        return () => cancelAnimationFrame(frameId)
    }, [])

    return (
        <div className="fixed bottom-4 right-4 pointer-events-none z-40 hidden lg:block opacity-60">
            <div className="bg-black/80 border-t border-l border-cyan-500/30 p-3 rounded-tl-xl backdrop-blur-sm">
                <div className="flex gap-4 items-end mb-2">
                    <div className="text-[10px] font-mono text-cyan-500">
                        <div>CPU_LOAD</div>
                        <div className="text-lg text-white">{stats.cpu}%</div>
                    </div>
                    <div className="text-[10px] font-mono text-purple-400">
                        <div>V_RAM</div>
                        <div className="text-lg text-white">{stats.ram}GB</div>
                    </div>
                    <div className="text-[10px] font-mono text-green-400">
                        <div>NET_IO</div>
                        <div className="text-lg text-white">{stats.net}Mbps</div>
                    </div>
                </div>
                <canvas ref={canvasRef} width={200} height={40} className="w-[200px] h-[40px]" />
                <div className="text-[9px] text-gray-600 mt-1 font-mono tracking-widest text-right">NEURAL ACTIVITY MONITOR</div>
            </div>
        </div>
    )
}
