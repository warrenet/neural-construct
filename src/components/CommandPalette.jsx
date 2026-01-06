import { useState, useEffect, useRef } from 'react'

const COMMANDS = [
    { id: 'clear', label: '🗑️ Clear Chat History', shortcut: 'Ctrl+Shift+C', category: 'Actions' },
    { id: 'templates', label: '📋 Open Templates', shortcut: 'T', category: 'Navigation' },
    { id: 'help', label: '❓ Help & Guide', shortcut: 'H', category: 'Navigation' },
    { id: 'cortex', label: '🧠 Open Cortex (3D Graph)', shortcut: 'G', category: 'Navigation' },
    { id: 'cloud', label: '☁️ Cloud Connect', shortcut: 'C', category: 'Settings' },
    { id: 'lock', label: '🔒 Lock Vault', shortcut: 'L', category: 'Settings' },
    { id: 'export', label: '📤 Export Chat', shortcut: 'E', category: 'Actions' },
    // Personas
    { id: 'persona:architect', label: '🏛️ Switch to Architect', category: 'Personas' },
    { id: 'persona:vibe_coder', label: '⚡ Switch to Vibe Coder', category: 'Personas' },
    { id: 'persona:strategist', label: '🎯 Switch to Strategist', category: 'Personas' },
    // Modes
    { id: 'mode:sprint', label: '🏃 Sprint Mode', category: 'Modes' },
    { id: 'mode:deep', label: '🧠 Deep Mode', category: 'Modes' },
    { id: 'mode:matrix', label: '🌳 Matrix Mode', category: 'Modes' },
]

export default function CommandPalette({ isOpen, onClose, onCommand }) {
    const [search, setSearch] = useState('')
    const [selectedIndex, setSelectedIndex] = useState(0)
    const inputRef = useRef(null)

    const filtered = COMMANDS.filter(cmd =>
        cmd.label.toLowerCase().includes(search.toLowerCase()) ||
        cmd.category.toLowerCase().includes(search.toLowerCase())
    )

    // Focus input when opened
    useEffect(() => {
        if (isOpen) {
            setSearch('')
            setSelectedIndex(0)
            setTimeout(() => inputRef.current?.focus(), 50)
        }
    }, [isOpen])

    // Keyboard navigation
    useEffect(() => {
        if (!isOpen) return

        const handleKey = (e) => {
            if (e.key === 'ArrowDown') {
                e.preventDefault()
                setSelectedIndex(i => Math.min(i + 1, filtered.length - 1))
            } else if (e.key === 'ArrowUp') {
                e.preventDefault()
                setSelectedIndex(i => Math.max(i - 1, 0))
            } else if (e.key === 'Enter' && filtered[selectedIndex]) {
                e.preventDefault()
                onCommand(filtered[selectedIndex].id)
                onClose()
            } else if (e.key === 'Escape') {
                onClose()
            }
        }

        window.addEventListener('keydown', handleKey)
        return () => window.removeEventListener('keydown', handleKey)
    }, [isOpen, filtered, selectedIndex, onCommand, onClose])

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] animate-fade-in" onClick={onClose}>
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

            <div
                className="relative bg-gray-900 border border-cyan-500/30 rounded-xl w-full max-w-lg shadow-2xl shadow-cyan-500/10 overflow-hidden"
                onClick={e => e.stopPropagation()}
            >
                {/* Search Input */}
                <div className="border-b border-gray-800 p-4">
                    <div className="flex items-center gap-3">
                        <span className="text-cyan-400 text-lg">⌘</span>
                        <input
                            ref={inputRef}
                            type="text"
                            value={search}
                            onChange={e => { setSearch(e.target.value); setSelectedIndex(0) }}
                            placeholder="Type a command..."
                            className="flex-1 bg-transparent border-none outline-none text-white text-lg placeholder-gray-500"
                        />
                        <kbd className="kbd text-xs">ESC</kbd>
                    </div>
                </div>

                {/* Results */}
                <div className="max-h-80 overflow-y-auto p-2">
                    {filtered.length === 0 ? (
                        <div className="text-gray-500 text-center py-8">No commands found</div>
                    ) : (
                        filtered.map((cmd, i) => (
                            <button
                                key={cmd.id}
                                onClick={() => { onCommand(cmd.id); onClose() }}
                                className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-all ${i === selectedIndex
                                        ? 'bg-cyan-500/20 text-cyan-300'
                                        : 'text-gray-300 hover:bg-gray-800'
                                    }`}
                            >
                                <span>{cmd.label}</span>
                                <span className="text-xs text-gray-500">{cmd.category}</span>
                            </button>
                        ))
                    )}
                </div>

                {/* Footer */}
                <div className="border-t border-gray-800 p-3 flex justify-between text-xs text-gray-500">
                    <span>↑↓ Navigate</span>
                    <span>↵ Select</span>
                    <span>ESC Close</span>
                </div>
            </div>
        </div>
    )
}
