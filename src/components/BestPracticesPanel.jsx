import { useState } from 'react'

const MODE_TIPS = {
    sprint: [
        "Best for quick queries and simple code generation.",
        "Use 'vibe_coder' persona for optimal code results.",
        "Keep prompts specific and concise."
    ],
    deep: [
        "Uses Chain of Thought reasoning.",
        "Good for complex logic and debugging.",
        "Response times are slower but higher quality.",
        "Ask for 'reasoning first, then code'."
    ],
    matrix: [
        "Simulates multiple parallel agents.",
        "Ideal for divergent thinking and brainstorming.",
        "Agents will identify different aspects of the problem.",
        "Final synthesis combines all perspectives."
    ],
    swarm: [
        "Sequential agent pipline: Architect → Coder → Strategist.",
        "Best for full features or complex refactors.",
        "Architect designs, Coder builds, Strategist reviews.",
        "Use clear, high-level feature requirements."
    ],
    reflection: [
        "AI critiques its own work.",
        "Great for improving draft content or code.",
        "Will produce an initial draft, then refine it."
    ],
    debate: [
        "Advocate vs Critic simulation.",
        "Perfect for making tough decisions.",
        "Review the Judge's synthesis for the final verdict."
    ],
    redteam: [
        "Adversarial security testing.",
        "Red Team attacks, Blue Team defends.",
        "Use to audit code or system designs."
    ],
    rubric: [
        "Scores output against quality criteria.",
        "Auto-fixes issues scoring below 85%.",
        "Ensures high-quality, production-ready output."
    ],
    socratic: [
        "Question-driven analysis.",
        "AI asks questions to deepen understanding.",
        "Good for learning concepts thoroughly."
    ]
}

export default function BestPracticesPanel({ mode, className }) {
    const [expanded, setExpanded] = useState(false)
    const tips = MODE_TIPS[mode] || MODE_TIPS['sprint']

    // Auto-collapse when mode changes
    // useEffect(() => setExpanded(true), [mode]) // Optional: auto-expand

    return (
        <div className={`border border-gray-800 rounded bg-gray-900/50 overflow-hidden text-sm transition-all duration-300 ${className} ${expanded ? 'shadow-lg shadow-cyan-900/10' : ''}`}>
            <button
                onClick={() => setExpanded(!expanded)}
                className="w-full p-3 flex items-center justify-between text-gray-400 hover:text-cyan-400 transition-colors bg-black/20"
            >
                <div className="flex items-center gap-2">
                    <span>💡</span>
                    <span className="font-bold uppercase tracking-wider text-xs">
                        {mode.toUpperCase()} Best Practices
                    </span>
                </div>
                <span className={`transform transition-transform ${expanded ? 'rotate-180' : ''}`}>
                    ▼
                </span>
            </button>

            {expanded && (
                <div className="p-4 space-y-3 animate-slide-down">
                    {tips.map((tip, i) => (
                        <div key={i} className="flex gap-2 text-gray-300 leading-relaxed">
                            <span className="text-cyan-500/50">•</span>
                            <span>{tip}</span>
                        </div>
                    ))}
                    <div className="mt-3 pt-3 border-t border-gray-800 text-[10px] text-gray-500 italic text-center">
                        Pro Tip: Try different modes for different tasks!
                    </div>
                </div>
            )}
        </div>
    )
}
