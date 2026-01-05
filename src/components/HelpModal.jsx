import { useState, useEffect } from 'react'

export default function HelpModal({ isOpen, onClose }) {
    // Close on Escape
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose()
        }
        if (isOpen) {
            document.addEventListener('keydown', handleEsc)
            return () => document.removeEventListener('keydown', handleEsc)
        }
    }, [isOpen, onClose])

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative panel p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto slide-up">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-cyan-400 glow-cyan">
                        🧠 Neural Construct Guide
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-white transition-colors text-2xl"
                    >
                        ×
                    </button>
                </div>

                {/* Quick Start */}
                <Section title="⚡ Quick Start">
                    <ol className="list-decimal list-inside space-y-2 text-gray-300">
                        <li>Enter your OpenRouter API key when prompted</li>
                        <li>Select a <span className="text-blue-400">Council member</span> (or enable Swarm)</li>
                        <li>Choose a <span className="text-purple-400">Reasoning Mode</span></li>
                        <li>Type your request and press Enter or click Send</li>
                    </ol>
                </Section>

                {/* The Council */}
                <Section title="👥 The Council">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <PersonaCard
                            icon="🏛️"
                            name="Architect"
                            color="text-blue-400"
                            desc="Designs systems, creates diagrams, defines schemas"
                        />
                        <PersonaCard
                            icon="⚡"
                            name="Vibe Coder"
                            color="text-green-400"
                            desc="Writes production-ready, copy-paste code"
                        />
                        <PersonaCard
                            icon="🎯"
                            name="Strategist"
                            color="text-red-400"
                            desc="Security review, code critique, hardening"
                        />
                    </div>
                </Section>

                {/* Reasoning Modes */}
                <Section title="🔀 Reasoning Modes">
                    <div className="space-y-2 text-sm">
                        <ModeRow icon="⚡" name="SPRINT" desc="Single-shot fast response" />
                        <ModeRow icon="🔗" name="DEEP" desc="Chain of Thought with visible reasoning" />
                        <ModeRow icon="🌳" name="MATRIX" desc="3 parallel branches → synthesis" />
                        <ModeRow icon="🪞" name="REFLECT" desc="Self-critique → improve → refine" />
                        <ModeRow icon="⚔️" name="DEBATE" desc="Advocate vs Critic → Judge verdict" />
                        <ModeRow icon="🔴" name="RED TEAM" desc="Attack simulation → Blue Team defense" />
                        <ModeRow icon="📊" name="RUBRIC" desc="Score against rubric, auto-fix below 85%" />
                        <ModeRow icon="🤔" name="SOCRATIC" desc="Question-driven deep analysis" />
                    </div>
                </Section>

                {/* Swarm Mode */}
                <Section title="🐝 Swarm Mode">
                    <p className="text-gray-400 text-sm">
                        When enabled, all 3 Council members collaborate in sequence:
                    </p>
                    <div className="flex items-center gap-2 mt-3 text-sm">
                        <span className="text-blue-400">🏛️ Architect</span>
                        <span className="text-gray-600">→</span>
                        <span className="text-green-400">⚡ Vibe Coder</span>
                        <span className="text-gray-600">→</span>
                        <span className="text-red-400">🎯 Strategist</span>
                    </div>
                </Section>

                {/* Keyboard Shortcuts */}
                <Section title="⌨️ Tips">
                    <ul className="space-y-2 text-sm text-gray-400">
                        <li>• Press <kbd className="kbd">Enter</kbd> to send your message</li>
                        <li>• Press <kbd className="kbd">Esc</kbd> to close this modal</li>
                        <li>• Free models are marked with 🆓 in the selector</li>
                        <li>• Your API key is stored locally and never sent to our servers</li>
                    </ul>
                </Section>

                <div className="mt-6 pt-4 border-t border-gray-800 text-center">
                    <button onClick={onClose} className="btn-primary">
                        Got it, let's go!
                    </button>
                </div>
            </div>
        </div>
    )
}

function Section({ title, children }) {
    return (
        <div className="mb-6">
            <h3 className="text-sm font-bold text-gray-300 mb-3 uppercase tracking-wider">
                {title}
            </h3>
            {children}
        </div>
    )
}

function PersonaCard({ icon, name, color, desc }) {
    return (
        <div className="panel p-3 panel-hover">
            <div className="flex items-center gap-2 mb-1">
                <span>{icon}</span>
                <span className={`font-medium ${color}`}>{name}</span>
            </div>
            <p className="text-xs text-gray-500">{desc}</p>
        </div>
    )
}

function ModeRow({ icon, name, desc }) {
    return (
        <div className="flex items-center gap-3 py-1">
            <span className="w-6 text-center">{icon}</span>
            <span className="w-20 font-medium text-gray-300">{name}</span>
            <span className="text-gray-500">{desc}</span>
        </div>
    )
}
