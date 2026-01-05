// ConfidenceMeter - Visual confidence indicator for AI responses

export default function ConfidenceMeter({ score, label }) {
    // Score should be 0-100
    const normalizedScore = Math.max(0, Math.min(100, score || 0))

    let color = 'bg-red-400'
    let textColor = 'text-red-400'
    let status = 'Low'

    if (normalizedScore >= 85) {
        color = 'bg-green-400'
        textColor = 'text-green-400'
        status = 'High'
    } else if (normalizedScore >= 70) {
        color = 'bg-yellow-400'
        textColor = 'text-yellow-400'
        status = 'Medium'
    } else if (normalizedScore >= 50) {
        color = 'bg-orange-400'
        textColor = 'text-orange-400'
        status = 'Fair'
    }

    return (
        <div className="space-y-1">
            {label && (
                <div className="text-xs text-gray-500">{label}</div>
            )}
            <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div
                        className={`h-full ${color} transition-all duration-500`}
                        style={{ width: `${normalizedScore}%` }}
                    />
                </div>
                <span className={`text-xs font-mono ${textColor}`}>
                    {normalizedScore}%
                </span>
            </div>
            <div className={`text-xs ${textColor}`}>
                {status} Confidence
            </div>
        </div>
    )
}

// Rubric Score Display
export function RubricScoreCard({ scores }) {
    if (!scores) return null

    const categories = [
        { id: 'correctness', name: 'Correctness', weight: 25 },
        { id: 'completeness', name: 'Completeness', weight: 20 },
        { id: 'clarity', name: 'Clarity', weight: 15 },
        { id: 'efficiency', name: 'Efficiency', weight: 15 },
        { id: 'security', name: 'Security', weight: 15 },
        { id: 'maintainability', name: 'Maintainability', weight: 10 }
    ]

    const weightedTotal = categories.reduce((acc, cat) => {
        const score = scores[cat.id] || 0
        return acc + (score * cat.weight / 100)
    }, 0)

    const needsFix = categories.filter(cat => (scores[cat.id] || 0) < 85)

    return (
        <div className="panel p-4 space-y-3">
            <div className="flex items-center justify-between">
                <div className="text-xs text-gray-500 uppercase tracking-wider">
                    Rubric Score
                </div>
                <div className={`text-lg font-bold ${weightedTotal >= 85 ? 'text-green-400' : 'text-yellow-400'}`}>
                    {Math.round(weightedTotal)}%
                </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
                {categories.map(cat => {
                    const score = scores[cat.id] || 0
                    const needsImprovement = score < 85
                    return (
                        <div key={cat.id} className={`text-xs p-2 rounded ${needsImprovement ? 'bg-yellow-400/10 border border-yellow-400/30' : 'bg-gray-800'}`}>
                            <div className="flex justify-between">
                                <span className="text-gray-400">{cat.name}</span>
                                <span className={needsImprovement ? 'text-yellow-400' : 'text-green-400'}>
                                    {score}%
                                </span>
                            </div>
                        </div>
                    )
                })}
            </div>

            {needsFix.length > 0 && (
                <div className="text-xs text-yellow-400 flex items-center gap-1">
                    <span>⚠️</span>
                    <span>{needsFix.length} categories need improvement (below 85%)</span>
                </div>
            )}
        </div>
    )
}
