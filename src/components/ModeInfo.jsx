// ModeInfo - Expandable info panel for currently selected reasoning mode

const MODE_DETAILS = {
    sprint: {
        title: 'Sprint Mode',
        icon: '⚡',
        color: 'text-yellow-400',
        description: 'Single-shot response. Fast and direct.',
        flow: ['User Input', 'Pass Zero Enhancement', 'Agent Response'],
        best_for: 'Quick questions, simple tasks, brainstorming'
    },
    deep: {
        title: 'Deep Mode (CoT)',
        icon: '🔗',
        color: 'text-purple-400',
        description: 'Chain of Thought reasoning with visible thinking process.',
        flow: ['User Input', 'Pass Zero', '<thinking> Analysis', '<answer> Response'],
        best_for: 'Complex problems, debugging, step-by-step explanations'
    },
    matrix: {
        title: 'Matrix Mode (ToT)',
        icon: '🌳',
        color: 'text-cyan-400',
        description: 'Tree of Thought with 3 parallel analysis branches.',
        flow: ['User Input', 'Branch A (Architecture)', 'Branch B (Implementation)', 'Branch C (Risks)', 'Synthesis'],
        best_for: 'Multi-faceted problems, design decisions, comprehensive analysis'
    },
    reflection: {
        title: 'Reflection Mode',
        icon: '🪞',
        color: 'text-pink-400',
        description: 'Self-critique and iterative improvement.',
        flow: ['Initial Response', 'Self-Critique', 'Refined Response'],
        best_for: 'Quality-critical output, essays, documentation'
    },
    debate: {
        title: 'Debate Mode',
        icon: '⚔️',
        color: 'text-orange-400',
        description: 'Opposing viewpoints synthesized into balanced verdict.',
        flow: ['Advocate (Pro)', 'Critic (Con)', 'Judge (Synthesis)'],
        best_for: 'Decision making, pros/cons analysis, controversial topics'
    },
    redteam: {
        title: 'Red Team Mode',
        icon: '🔴',
        color: 'text-red-500',
        description: 'Adversarial attack simulation with defensive hardening.',
        flow: ['Initial Solution', 'Red Team Attack', 'Blue Team Defense'],
        best_for: 'Security review, vulnerability assessment, hardening code'
    },
    rubric: {
        title: 'Rubric Mode',
        icon: '📊',
        color: 'text-emerald-400',
        description: 'Scored against quality rubric with auto-fix for low scores.',
        flow: ['Initial Solution', 'Rubric Evaluation', 'Auto-Fix (if <85%)'],
        best_for: 'Quality assurance, meeting standards, polished deliverables'
    },
    socratic: {
        title: 'Socratic Mode',
        icon: '🤔',
        color: 'text-teal-400',
        description: 'Question-driven analysis that digs deep.',
        flow: ['Generate Core Questions', 'Deep Analysis', 'Comprehensive Synthesis'],
        best_for: 'Research, learning, understanding complex topics'
    }
}

export default function ModeInfo({ mode, expanded = false }) {
    const info = MODE_DETAILS[mode]
    if (!info) return null

    if (!expanded) {
        return (
            <div className={`flex items-center gap-2 text-xs ${info.color}`}>
                <span>{info.icon}</span>
                <span>{info.title}</span>
            </div>
        )
    }

    return (
        <div className="panel p-4 space-y-3">
            <div className="flex items-center gap-2">
                <span className="text-xl">{info.icon}</span>
                <h3 className={`font-bold ${info.color}`}>{info.title}</h3>
            </div>

            <p className="text-sm text-gray-400">{info.description}</p>

            <div>
                <div className="text-xs text-gray-500 mb-2">Processing Flow:</div>
                <div className="flex flex-wrap items-center gap-1 text-xs">
                    {info.flow.map((step, i) => (
                        <span key={i} className="flex items-center gap-1">
                            <span className="px-2 py-1 bg-gray-800 rounded">{step}</span>
                            {i < info.flow.length - 1 && <span className="text-gray-600">→</span>}
                        </span>
                    ))}
                </div>
            </div>

            <div className="text-xs text-gray-500">
                <span className="text-gray-400">Best for:</span> {info.best_for}
            </div>
        </div>
    )
}

export { MODE_DETAILS }
