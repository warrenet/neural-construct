// PassProgress - Visual progress indicator for multi-pass reasoning modes

export default function PassProgress({ passes, currentPass, passResults }) {
    if (!passes || passes.length === 0) return null

    return (
        <div className="panel p-4 space-y-3">
            <div className="text-xs text-gray-500 uppercase tracking-wider">
                Multi-Pass Progress
            </div>

            <div className="space-y-2">
                {passes.map((pass, index) => {
                    const isComplete = passResults && passResults[index]
                    const isCurrent = currentPass === index
                    const isPending = currentPass < index

                    let statusColor = 'text-gray-600'
                    let borderColor = 'border-gray-700'
                    let bgColor = 'bg-transparent'

                    if (isComplete) {
                        statusColor = 'text-green-400'
                        borderColor = 'border-green-400/30'
                        bgColor = 'bg-green-400/5'
                    } else if (isCurrent) {
                        statusColor = 'text-cyan-400'
                        borderColor = 'border-cyan-400/50'
                        bgColor = 'bg-cyan-400/10'
                    }

                    return (
                        <div
                            key={index}
                            className={`flex items-center gap-3 p-3 rounded border ${borderColor} ${bgColor} transition-all duration-300`}
                        >
                            {/* Step Number */}
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${isComplete ? 'bg-green-400 text-black' :
                                isCurrent ? 'bg-cyan-400 text-black' :
                                    'bg-gray-700 text-gray-400'
                                }`}>
                                {isComplete ? '✓' : index + 1}
                            </div>

                            {/* Pass Info */}
                            <div className="flex-1">
                                <div className={`text-sm font-medium ${statusColor}`}>
                                    {pass.name}
                                </div>
                                {pass.role && (
                                    <div className="text-xs text-gray-600">
                                        Role: {pass.role}
                                    </div>
                                )}
                            </div>

                            {/* Status */}
                            <div className={`text-xs ${statusColor}`}>
                                {isCurrent && (
                                    <span className="flex items-center gap-1">
                                        <span className="animate-pulse">●</span>
                                        Running...
                                    </span>
                                )}
                                {isComplete && 'Done'}
                                {isPending && 'Pending'}
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Progress Bar */}
            <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                <div
                    className="h-full bg-gradient-to-r from-cyan-400 to-green-400 transition-all duration-500"
                    style={{
                        width: `${((passResults?.filter(Boolean).length || 0) / passes.length) * 100}%`
                    }}
                />
            </div>
        </div>
    )
}
