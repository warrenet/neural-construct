import { useState } from 'react'

export default function PromptEnhancer({ currentInput, onEnhance, onClose }) {
    const [fields, setFields] = useState({
        context: '',
        task: currentInput || '',
        constraints: '',
        format: ''
    })

    const handleEnhance = () => {
        const parts = []
        if (fields.context) parts.push(`CONTEXT: ${fields.context}`)
        if (fields.task) parts.push(`TASK: ${fields.task}`)
        if (fields.constraints) parts.push(`CONSTRAINTS: ${fields.constraints}`)
        if (fields.format) parts.push(`OUTPUT FORMAT: ${fields.format}`)

        onEnhance(parts.join('\n\n'))
        onClose()
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="panel w-full max-w-lg bg-gray-900 border border-cyan-500/30 shadow-2xl animate-scale-in">
                <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-cyan-900/10">
                    <h3 className="text-lg font-bold text-cyan-400 flex items-center gap-2">
                        <span>✨</span> Prompt Enhancer
                    </h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-white">×</button>
                </div>

                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Context / Role</label>
                        <input
                            className="w-full bg-black/30 border border-gray-700 rounded p-2 text-sm text-gray-300 focus:border-cyan-500"
                            placeholder="e.g. You are a senior React engineer..."
                            value={fields.context}
                            onChange={e => setFields({ ...fields, context: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-cyan-500 uppercase mb-1">Core Task</label>
                        <textarea
                            className="w-full bg-black/30 border border-cyan-700/50 rounded p-2 text-sm text-white focus:border-cyan-500 h-24"
                            placeholder="What exactly should the AI do?"
                            value={fields.task}
                            onChange={e => setFields({ ...fields, task: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Constraints</label>
                            <input
                                className="w-full bg-black/30 border border-gray-700 rounded p-2 text-sm text-gray-300 focus:border-cyan-500"
                                placeholder="e.g. No external libraries..."
                                value={fields.constraints}
                                onChange={e => setFields({ ...fields, constraints: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Output Format</label>
                            <input
                                className="w-full bg-black/30 border border-gray-700 rounded p-2 text-sm text-gray-300 focus:border-cyan-500"
                                placeholder="e.g. Markdown list..."
                                value={fields.format}
                                onChange={e => setFields({ ...fields, format: e.target.value })}
                            />
                        </div>
                    </div>
                </div>

                <div className="p-4 border-t border-gray-800 flex justify-end gap-3 bg-gray-900/50">
                    <button onClick={onClose} className="px-4 py-2 text-sm text-gray-400 hover:text-white">Cancel</button>
                    <button onClick={handleEnhance} className="btn-primary px-6 py-2 text-sm flex items-center gap-2">
                        <span>✨</span> Apply Enhancement
                    </button>
                </div>
            </div>
        </div>
    )
}
