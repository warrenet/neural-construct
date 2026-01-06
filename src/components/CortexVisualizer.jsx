import { useState, useMemo, useRef, useEffect } from 'react'
import ForceGraph3D from 'react-force-graph-3d'

export default function CortexVisualizer({ isOpen, onClose }) {
    const fgRef = useRef()
    const [activeNode, setActiveNode] = useState(null)

    // Generate initial "Neural" Data
    const data = useMemo(() => {
        const nodes = [
            { id: 'root', name: 'THE CORTEX', val: 20, color: '#00d4ff', group: 'core' },
            { id: 'memory', name: 'Deep Memory', val: 10, color: '#a78bfa', group: 'system' },
            { id: 'reasoning', name: 'Reasoning Engine', val: 10, color: '#a78bfa', group: 'system' },
            { id: 'personas', name: 'Personas', val: 8, color: '#34d399', group: 'system' },
            // Mock Data 
            { id: 'doc1', name: 'Project_Alpha.pdf', val: 5, color: '#94a3b8', group: 'data' },
            { id: 'doc2', name: 'Research_Notes.txt', val: 5, color: '#94a3b8', group: 'data' },
            { id: 'chat1', name: 'Chat: Strategy', val: 3, color: '#64748b', group: 'chat' },
            { id: 'chat2', name: 'Chat: Code Review', val: 3, color: '#64748b', group: 'chat' }
        ]

        const links = [
            { source: 'root', target: 'memory' },
            { source: 'root', target: 'reasoning' },
            { source: 'root', target: 'personas' },
            { source: 'memory', target: 'doc1' },
            { source: 'memory', target: 'doc2' },
            { source: 'personas', target: 'chat1' },
            { source: 'reasoning', target: 'chat1' },
            { source: 'reasoning', target: 'chat2' }
        ]

        return { nodes, links }
    }, [])

    useEffect(() => {
        if (isOpen && fgRef.current) {
            // Initial camera orbit
            fgRef.current.d3Force('charge').strength(-120)
        }
    }, [isOpen])

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-[60] bg-black animate-fade-in">
            {/* UI Overlay */}
            <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-start pointer-events-none z-10">
                <div>
                    <h2 className="text-3xl font-bold text-cyan-400 glow-cyan flex items-center gap-3">
                        <span className="text-4xl">🧠</span> THE CORTEX
                    </h2>
                    <p className="text-gray-400 font-mono text-sm mt-1 tracking-widest uppercase">
                        Visual Knowledge Matrix • v0.1
                    </p>
                </div>
                <button
                    onClick={onClose}
                    className="pointer-events-auto btn-secondary bg-black/50 backdrop-blur text-2xl px-4 py-2 border-red-500/30 text-red-400 hover:text-red-300 hover:border-red-500"
                >
                    ×
                </button>
            </div>

            <div className="absolute bottom-6 left-6 z-10 pointer-events-none">
                <div className="bg-black/50 backdrop-blur p-4 rounded border border-gray-800 text-xs font-mono space-y-2">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_10px_#06b6d4]"></div>
                        <span className="text-gray-300">CORE SYSTEM</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-purple-400"></div>
                        <span className="text-gray-300">MODULES</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-slate-400"></div>
                        <span className="text-gray-300">DATA & CHATS</span>
                    </div>

                    {activeNode && (
                        <div className="mt-4 pt-4 border-t border-gray-700 animate-fade-in">
                            <div className="text-xs text-cyan-400 font-bold mb-1">SELECTED DATA</div>
                            <div className="text-white font-mono text-sm">{activeNode.name}</div>
                            <div className="text-[10px] text-gray-500 uppercase mt-1">ID: {activeNode.id} • TYPE: {activeNode.group}</div>
                        </div>
                    )}
                </div>
            </div>

            {/* 3D Graph */}
            <ForceGraph3D
                ref={fgRef}
                graphData={data}
                backgroundColor="#000000"
                nodeLabel="name"
                nodeColor="color"
                nodeRelSize={6}
                linkColor={() => 'rgba(255,255,255,0.2)'}
                linkWidth={1}
                enableNodeDrag={false}
                onNodeClick={node => {
                    setActiveNode(node)
                    const distance = 40
                    const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z)
                    fgRef.current.cameraPosition(
                        { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio },
                        node,
                        3000
                    )
                }}
                nodeThreeObjectExtend={true}
            />
        </div>
    )
}
