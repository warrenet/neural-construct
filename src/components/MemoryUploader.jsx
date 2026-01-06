import { useState, useRef } from 'react'
import { memorizeDocument } from '../lib/memory'
import { useToast } from '../hooks/useToast'

export default function MemoryUploader({ onComplete }) {
    const { toast } = useToast()
    const [isUploading, setIsUploading] = useState(false)
    const [progress, setProgress] = useState('')
    const fileRef = useRef(null)

    // Simple embedding function using OpenRouter
    const getEmbedding = async () => {
        // For now, return a placeholder - full embedding requires embedding API
        // This is a stub that allows the UI to work
        return new Array(1536).fill(0).map(() => Math.random() * 2 - 1)
    }

    const handleFileSelect = async (e) => {
        const file = e.target.files?.[0]
        if (!file) return

        setIsUploading(true)
        setProgress('Reading file...')

        try {
            const text = await file.text()
            setProgress('Chunking & vectorizing...')

            const chunks = await memorizeDocument(text, file.name, getEmbedding)

            setProgress('Complete!')
            toast.success(`📚 Memorized ${chunks} chunks from ${file.name}`)
            onComplete?.()
        } catch (err) {
            console.error('Memory upload failed:', err)
            toast.error('Upload failed: ' + err.message)
        } finally {
            setIsUploading(false)
            setProgress('')
            if (fileRef.current) fileRef.current.value = ''
        }
    }

    return (
        <div className="panel p-4 space-y-3">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-sm font-bold text-purple-400">🧠 Deep Memory</h3>
                    <p className="text-xs text-gray-500">Upload documents to enhance AI recall</p>
                </div>
                {isUploading && (
                    <span className="text-xs text-cyan-400 animate-pulse">{progress}</span>
                )}
            </div>

            <input
                ref={fileRef}
                type="file"
                accept=".txt,.md,.json,.csv"
                onChange={handleFileSelect}
                disabled={isUploading}
                className="hidden"
                id="memory-upload"
            />

            <label
                htmlFor="memory-upload"
                className={`block text-center py-3 border-2 border-dashed rounded-lg cursor-pointer transition-all ${isUploading
                    ? 'border-gray-700 text-gray-600 cursor-wait'
                    : 'border-purple-500/30 text-purple-400 hover:border-purple-500 hover:bg-purple-500/5'
                    }`}
            >
                {isUploading ? '⏳ Processing...' : '📄 Drop or click to upload'}
            </label>

            <p className="text-[10px] text-gray-600 text-center">
                Supports: .txt, .md, .json, .csv
            </p>
        </div>
    )
}
