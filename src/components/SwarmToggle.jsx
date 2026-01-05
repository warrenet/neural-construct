import { useState } from 'react'

export default function SwarmToggle({ enabled, onToggle, disabled }) {
    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <div>
                    <div className="text-xs text-gray-500 uppercase tracking-wider">
                        Swarm Mode
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                        Multi-agent collaborative reasoning
                    </div>
                </div>
                <button
                    onClick={() => onToggle(!enabled)}
                    disabled={disabled}
                    className={`
            relative w-14 h-7 rounded-full transition-all duration-300
            ${enabled
                            ? 'bg-gradient-to-r from-purple-500 to-cyan-500'
                            : 'bg-gray-700'
                        }
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
                >
                    <div className={`
            absolute top-1 w-5 h-5 rounded-full bg-white shadow-lg
            transition-all duration-300
            ${enabled ? 'left-8' : 'left-1'}
          `}>
                        {enabled && (
                            <span className="absolute inset-0 flex items-center justify-center text-xs">
                                🐝
                            </span>
                        )}
                    </div>
                </button>
            </div>

            {enabled && (
                <div className="panel p-3 bg-purple-400/5 border-purple-400/20 text-xs space-y-2">
                    <div className="text-purple-400 font-medium">🐝 Swarm Active</div>
                    <ul className="text-gray-400 space-y-1 list-disc list-inside">
                        <li>All 3 Council agents collaborate</li>
                        <li>Architect designs → Vibe Coder implements → Strategist reviews</li>
                        <li>Each agent builds on previous output</li>
                    </ul>
                </div>
            )}
        </div>
    )
}
