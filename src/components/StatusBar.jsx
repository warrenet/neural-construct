// StatusBar - Real-time system status and connection health

export default function StatusBar({
    isConnected = true,
    currentModel,
    currentMode,
    tokensUsed = 0,
    isStreaming = false
}) {
    return (
        <div className="flex items-center justify-between px-4 py-2 bg-gray-900/50 border-b border-gray-800 text-xs">
            {/* Left: Connection Status */}
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
                    <span className={isConnected ? 'text-green-400' : 'text-red-400'}>
                        {isConnected ? 'ONLINE' : 'OFFLINE'}
                    </span>
                </div>

                {isStreaming && (
                    <div className="flex items-center gap-2 text-cyan-400">
                        <span className="animate-pulse">●</span>
                        <span>STREAMING</span>
                    </div>
                )}
            </div>

            {/* Center: Current Config */}
            <div className="flex items-center gap-4 text-gray-500">
                {currentMode && (
                    <span className="px-2 py-0.5 bg-gray-800 rounded">
                        {currentMode.toUpperCase()}
                    </span>
                )}
                {currentModel && (
                    <span className="text-gray-600 truncate max-w-48">
                        {currentModel.split('/').pop()}
                    </span>
                )}
            </div>

            {/* Right: Token Counter */}
            <div className="flex items-center gap-2 text-gray-600">
                <span>Tokens:</span>
                <span className={tokensUsed > 50000 ? 'text-yellow-400' : 'text-gray-400'}>
                    {tokensUsed.toLocaleString()}
                </span>
            </div>
        </div>
    )
}
