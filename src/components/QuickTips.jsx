/**
 * QuickTips - Floating tips button with searchable contextual help drawer
 * Provides persistent access to tips and guidance throughout the app
 */
import { useState, useMemo } from 'react'

// Comprehensive tips organized by category
const TIPS = [
    // Getting Started
    { id: 'welcome', category: 'basics', icon: '👋', title: 'Welcome to The Construct', content: 'This is your AI command center. Choose an agent, select a mode, and start building.' },
    { id: 'api-key', category: 'basics', icon: '🔑', title: 'API Key Security', content: 'Your API key is encrypted locally using AES-256. It never leaves your browser.' },
    { id: 'free-models', category: 'basics', icon: '🆓', title: 'Free Models', content: 'Models marked FREE don\'t cost anything to use. Great for testing!' },

    // Council (Personas)
    { id: 'architect', category: 'council', icon: '🏛️', title: 'The Architect', content: 'Best for system design, data flows, and architecture diagrams. Outputs Mermaid.js.' },
    { id: 'vibe-coder', category: 'council', icon: '⚡', title: 'The Vibe Coder', content: 'Writes production-ready code. Copy-paste ready with error handling built in.' },
    { id: 'strategist', category: 'council', icon: '🎯', title: 'Based Strategist', content: 'Security-focused code reviewer. Finds vulnerabilities and suggests hardening.' },

    // Modes
    { id: 'sprint', category: 'modes', icon: '⚡', title: 'SPRINT Mode', content: 'Fast, single-shot responses. Best for quick questions and simple tasks.' },
    { id: 'deep', category: 'modes', icon: '🔗', title: 'DEEP Mode', content: 'Chain of Thought reasoning. See the AI\'s thinking process with <thinking> tags.' },
    { id: 'matrix', category: 'modes', icon: '🌳', title: 'MATRIX Mode', content: '3 parallel analysis branches (Architecture, Implementation, Risks) → synthesized answer.' },
    { id: 'swarm', category: 'modes', icon: '🐝', title: 'Swarm Mode', content: 'All 3 agents collaborate: Architect designs → Coder implements → Strategist reviews.' },
    { id: 'redteam', category: 'modes', icon: '🔴', title: 'RED TEAM Mode', content: 'Adversarial security testing. Attacks your code, then provides defensive fixes.' },
    { id: 'rubric', category: 'modes', icon: '📊', title: 'RUBRIC Mode', content: 'Scores code against quality rubric. Auto-fixes anything below 85%.' },

    // Pro Tips
    { id: 'templates', category: 'pro', icon: '📋', title: 'Use Templates', content: 'Click 📋 to access 50+ pre-built prompts for common tasks.' },
    { id: 'keyboard', category: 'pro', icon: '⌨️', title: 'Keyboard Shortcuts', content: 'Press Enter to send, Esc to close modals, Tab to navigate.' },
    { id: 'history', category: 'pro', icon: '💾', title: 'Chat History', content: 'Your last 50 messages are saved locally. Clear with the 🗑️ button.' },
]

const CATEGORIES = [
    { id: 'all', name: 'All Tips', icon: '✨' },
    { id: 'basics', name: 'Getting Started', icon: '🚀' },
    { id: 'council', name: 'The Council', icon: '👥' },
    { id: 'modes', name: 'Modes', icon: '🔀' },
    { id: 'pro', name: 'Pro Tips', icon: '💡' },
]

export default function QuickTips() {
    const [isOpen, setIsOpen] = useState(false)
    const [search, setSearch] = useState('')
    const [category, setCategory] = useState('all')

    const filteredTips = useMemo(() => {
        return TIPS.filter(tip => {
            const matchesCategory = category === 'all' || tip.category === category
            const matchesSearch = search === '' ||
                tip.title.toLowerCase().includes(search.toLowerCase()) ||
                tip.content.toLowerCase().includes(search.toLowerCase())
            return matchesCategory && matchesSearch
        })
    }, [search, category])

    return (
        <>
            {/* Floating Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-20 right-4 z-40 w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 text-white shadow-lg shadow-purple-500/30 hover:scale-110 hover:shadow-xl hover:shadow-cyan-500/30 transition-all duration-200 flex items-center justify-center text-xl"
                title="Quick Tips"
            >
                💡
            </button>

            {/* Tips Drawer */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex justify-end">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Drawer Panel */}
                    <div className="relative w-full max-w-md bg-gray-900 border-l border-gray-800 shadow-2xl animate-slide-in flex flex-col">
                        {/* Header */}
                        <div className="p-4 border-b border-gray-800 bg-gray-900/80 backdrop-blur-sm">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-bold text-cyan-400 flex items-center gap-2">
                                    <span>💡</span> Quick Tips
                                </h2>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="text-gray-500 hover:text-white text-2xl transition-colors"
                                >
                                    ×
                                </button>
                            </div>

                            {/* Search */}
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">🔍</span>
                                <input
                                    type="text"
                                    placeholder="Search tips..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full pl-10 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm"
                                    autoFocus
                                />
                            </div>

                            {/* Category Tabs */}
                            <div className="flex gap-1 mt-3 overflow-x-auto pb-1">
                                {CATEGORIES.map(cat => (
                                    <button
                                        key={cat.id}
                                        onClick={() => setCategory(cat.id)}
                                        className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs transition-all ${category === cat.id
                                                ? 'bg-cyan-400/20 text-cyan-400 border border-cyan-400/30'
                                                : 'bg-gray-800 text-gray-400 border border-transparent hover:border-gray-700'
                                            }`}
                                    >
                                        {cat.icon} {cat.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Tips List */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-3">
                            {filteredTips.length === 0 ? (
                                <div className="text-center text-gray-500 py-8">
                                    <div className="text-4xl mb-2">🔍</div>
                                    <p>No tips found matching your search</p>
                                </div>
                            ) : (
                                filteredTips.map(tip => (
                                    <TipCard key={tip.id} tip={tip} />
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-4 border-t border-gray-800 text-center">
                            <p className="text-xs text-gray-600">
                                {filteredTips.length} tips available
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

function TipCard({ tip }) {
    return (
        <div className="panel p-4 hover:border-cyan-400/30 transition-colors">
            <div className="flex items-start gap-3">
                <span className="text-2xl">{tip.icon}</span>
                <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-200 mb-1">{tip.title}</h3>
                    <p className="text-sm text-gray-400 leading-relaxed">{tip.content}</p>
                </div>
            </div>
        </div>
    )
}
