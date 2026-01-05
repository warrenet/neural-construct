import { ADVANCED_MODES } from '../lib/advancedReasoning'

const REASONING_MODES = [
    {
        id: 'sprint',
        name: 'SPRINT',
        icon: '⚡',
        description: 'Single-shot. Fast. Direct.',
        color: 'text-yellow-400',
        bgActive: 'bg-yellow-400/20 border-yellow-400/50'
    },
    {
        id: 'deep',
        name: 'DEEP',
        icon: '🔗',
        description: 'Chain of Thought. Shows reasoning.',
        color: 'text-purple-400',
        bgActive: 'bg-purple-400/20 border-purple-400/50'
    },
    {
        id: 'matrix',
        name: 'MATRIX',
        icon: '🌳',
        description: 'Tree of Thought. 3 parallel agents.',
        color: 'text-cyan-400',
        bgActive: 'bg-cyan-400/20 border-cyan-400/50'
    }
]

const ADVANCED_MODE_LIST = [
    {
        id: 'reflection',
        name: 'REFLECT',
        icon: '🪞',
        description: 'Self-critique → Improve → Refine',
        color: 'text-pink-400',
        bgActive: 'bg-pink-400/20 border-pink-400/50'
    },
    {
        id: 'debate',
        name: 'DEBATE',
        icon: '⚔️',
        description: 'Advocate vs Critic → Judge',
        color: 'text-orange-400',
        bgActive: 'bg-orange-400/20 border-orange-400/50'
    },
    {
        id: 'redteam',
        name: 'RED TEAM',
        icon: '🔴',
        description: 'Attack → Defend → Harden',
        color: 'text-red-500',
        bgActive: 'bg-red-500/20 border-red-500/50'
    },
    {
        id: 'rubric',
        name: 'RUBRIC',
        icon: '📊',
        description: 'Score → Auto-fix below 85%',
        color: 'text-emerald-400',
        bgActive: 'bg-emerald-400/20 border-emerald-400/50'
    },
    {
        id: 'socratic',
        name: 'SOCRATIC',
        icon: '🤔',
        description: 'Question-driven deep analysis',
        color: 'text-teal-400',
        bgActive: 'bg-teal-400/20 border-teal-400/50'
    }
]

export default function ReasoningToggle({ selected, onSelect, disabled, showAdvanced = true }) {
    const allModes = [...REASONING_MODES, ...ADVANCED_MODE_LIST]
    const selectedMode = allModes.find(m => m.id === selected)

    return (
        <div className="space-y-3">
            <div className="text-xs text-gray-500 uppercase tracking-wider">
                Reasoning Mode
            </div>

            {/* Primary modes */}
            <div className="flex rounded-lg border border-gray-700 overflow-hidden">
                {REASONING_MODES.map((mode, index) => {
                    const isSelected = selected === mode.id
                    return (
                        <button
                            key={mode.id}
                            onClick={() => onSelect(mode.id)}
                            disabled={disabled}
                            className={`
                flex-1 py-3 px-2 transition-all duration-200
                ${isSelected
                                    ? `${mode.bgActive} ${mode.color}`
                                    : 'bg-transparent text-gray-400 hover:bg-gray-800'
                                }
                ${index < REASONING_MODES.length - 1 ? 'border-r border-gray-700' : ''}
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
                            title={mode.description}
                        >
                            <div className="text-center">
                                <div className="text-lg mb-1">{mode.icon}</div>
                                <div className="text-xs font-medium">{mode.name}</div>
                            </div>
                        </button>
                    )
                })}
            </div>

            {/* Advanced modes */}
            {showAdvanced && (
                <>
                    <div className="text-xs text-gray-600 uppercase tracking-wider">
                        Advanced
                    </div>
                    <div className="grid grid-cols-5 gap-1">
                        {ADVANCED_MODE_LIST.map((mode) => {
                            const isSelected = selected === mode.id
                            return (
                                <button
                                    key={mode.id}
                                    onClick={() => onSelect(isSelected ? 'sprint' : mode.id)}
                                    disabled={disabled}
                                    className={`
                    py-2 px-1 rounded border transition-all duration-200 text-xs
                    ${isSelected
                                            ? `${mode.bgActive} ${mode.color}`
                                            : 'bg-transparent border-gray-700 text-gray-500 hover:border-gray-600 hover:text-gray-400'
                                        }
                    ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                  `}
                                    title={mode.description}
                                >
                                    <div className="text-center">
                                        <div className="text-base">{mode.icon}</div>
                                    </div>
                                </button>
                            )
                        })}
                    </div>
                </>
            )}

            {/* Mode description */}
            <div className={`text-xs text-center ${selectedMode?.color || 'text-gray-600'}`}>
                {selectedMode?.description}
            </div>
        </div>
    )
}

export { REASONING_MODES, ADVANCED_MODE_LIST }
