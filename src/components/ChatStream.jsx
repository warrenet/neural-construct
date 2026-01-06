import { useRef, useEffect, useState } from 'react'
import { LoadingDots } from './GlitchText'
import MatrixText from './MatrixText'

export default function ChatStream({ messages, isStreaming, currentStream, branches }) {
    const endRef = useRef(null)

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages, currentStream, branches])

    return (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
                <MessageBubble key={msg.id} message={msg} />
            ))}

            {/* Live streaming response */}
            {isStreaming && currentStream && (
                <div className="panel p-4 border-cyan-400/30">
                    <div className="text-xs text-cyan-400 mb-2 flex items-center gap-2">
                        <span className="animate-pulse">●</span>
                        {currentStream.persona} responding...
                    </div>
                    <div className="text-gray-200 whitespace-pre-wrap font-mono text-sm">
                        <MatrixText text={currentStream.content} active={true} />
                    </div>
                </div>
            )}

            {/* MATRIX mode: Show parallel branches with REAL responses */}
            {branches && (
                <div className="space-y-4">
                    <div className="text-xs text-purple-400 uppercase tracking-wider text-center">
                        ━━━ Tree of Thought: Parallel Analysis ━━━
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        {['a', 'b', 'c'].map((branchId) => (
                            <BranchPanel
                                key={branchId}
                                branchId={branchId}
                                branch={branches[branchId]}
                            />
                        ))}
                    </div>
                    {branches.synthesis && (
                        <div className="panel p-4 border-green-400/30 bg-green-400/5">
                            <div className="text-xs text-green-400 mb-2 font-bold">
                                🔮 SYNTHESIS — Converged Response
                            </div>
                            <div className="text-gray-200 whitespace-pre-wrap font-mono text-sm">
                                {branches.synthesis.content}
                                {branches.synthesis.streaming && <span className="typewriter-cursor"></span>}
                            </div>
                        </div>
                    )}
                </div>
            )}

            <div ref={endRef} />
        </div>
    )
}

function MessageBubble({ message }) {
    const isUser = message.role === 'user'
    const isSystem = message.role === 'system'
    const [copied, setCopied] = useState(false)

    const handleCopy = async () => {
        await navigator.clipboard.writeText(message.content)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    if (isSystem) {
        return (
            <div className="text-center text-xs text-gray-600 py-2">
                {message.content}
            </div>
        )
    }

    // Parse thinking tags for DEEP mode display
    const { thinking, answer } = parseThinkingTags(message.content)

    return (
        <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} group`}>
            <div className={`max-w-[85%] ${isUser ? 'order-2' : ''}`}>
                {!isUser && message.persona && (
                    <div className={`text-xs mb-1 ${getPersonaColor(message.persona)}`}>
                        {getPersonaIcon(message.persona)} {message.persona}
                    </div>
                )}

                {/* Show thinking process if DEEP mode */}
                {thinking && (
                    <div className="panel p-3 mb-2 bg-purple-400/5 border-purple-400/20">
                        <div className="text-xs text-purple-400 mb-1">💭 Reasoning Process</div>
                        <div className="text-gray-400 text-sm font-mono whitespace-pre-wrap">
                            {thinking}
                        </div>
                    </div>
                )}

                <div className={`panel p-4 relative ${isUser
                    ? 'bg-cyan-400/10 border-cyan-400/30'
                    : 'bg-gray-800/50 border-gray-700'
                    }`}>
                    <div className="text-gray-200 whitespace-pre-wrap font-mono text-sm">
                        {answer || message.content}
                    </div>

                    {/* Copy Button - only for AI responses */}
                    {!isUser && (
                        <button
                            onClick={handleCopy}
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-xs px-2 py-1 rounded bg-gray-700/50 hover:bg-gray-600 text-gray-400 hover:text-white"
                            title="Copy response"
                        >
                            {copied ? '✓ Copied' : '📋 Copy'}
                        </button>
                    )}
                </div>

                {message.timestamp && (
                    <div className="text-xs text-gray-600 mt-1">
                        {new Date(message.timestamp).toLocaleTimeString()}
                    </div>
                )}
            </div>
        </div>
    )
}

function BranchPanel({ branchId, branch }) {
    if (!branch) {
        return (
            <div className="panel p-4 border-gray-700 opacity-50">
                <div className="text-xs text-gray-500 mb-2">
                    Branch {branchId.toUpperCase()}
                </div>
                <div className="text-gray-600 text-sm">
                    <LoadingDots /> Initializing...
                </div>
            </div>
        )
    }

    const borderColor = branch.complete
        ? 'border-green-400/30'
        : branch.error
            ? 'border-red-400/30'
            : 'border-yellow-400/30'

    return (
        <div className={`panel p-4 ${borderColor}`}>
            <div className="flex items-center justify-between mb-2">
                <div className="text-xs text-gray-400">
                    Branch {branchId.toUpperCase()}
                </div>
                <div className="text-xs">
                    {branch.complete ? (
                        <span className="text-green-400">✓ Complete</span>
                    ) : branch.error ? (
                        <span className="text-red-400">✗ Error</span>
                    ) : (
                        <span className="text-yellow-400 animate-pulse">● Running</span>
                    )}
                </div>
            </div>
            <div className="text-gray-300 text-sm font-mono whitespace-pre-wrap max-h-48 overflow-y-auto">
                {branch.error ? (
                    <span className="text-red-400">{branch.error}</span>
                ) : (
                    <>
                        {branch.content}
                        {!branch.complete && <span className="typewriter-cursor"></span>}
                    </>
                )}
            </div>
        </div>
    )
}

// Parse <thinking> and <answer> tags from DEEP mode responses
function parseThinkingTags(content) {
    if (!content) return { thinking: null, answer: content }

    const thinkingMatch = content.match(/<thinking>([\s\S]*?)<\/thinking>/i)
    const answerMatch = content.match(/<answer>([\s\S]*?)<\/answer>/i)

    if (thinkingMatch || answerMatch) {
        return {
            thinking: thinkingMatch?.[1]?.trim() || null,
            answer: answerMatch?.[1]?.trim() || content.replace(/<thinking>[\s\S]*?<\/thinking>/gi, '').replace(/<answer>|<\/answer>/gi, '').trim()
        }
    }

    return { thinking: null, answer: content }
}

function getPersonaColor(persona) {
    const colors = {
        architect: 'text-blue-400',
        vibe_coder: 'text-green-400',
        strategist: 'text-red-400'
    }
    return colors[persona] || 'text-gray-400'
}

function getPersonaIcon(persona) {
    const icons = {
        architect: '🏛️',
        vibe_coder: '⚡',
        strategist: '🎯'
    }
    return icons[persona] || '🤖'
}
