import { useState } from 'react'
import { saveSupabaseConfig } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../hooks/useToast'

export default function CloudConnect({ isOpen, onClose }) {
    const { checkConnection } = useAuth()
    const { toast } = useToast()

    // Default to existing config if any, or empty
    const [url, setUrl] = useState('')
    const [key, setKey] = useState('')
    const [testing, setTesting] = useState(false)

    if (!isOpen) return null

    const handleConnect = async (e) => {
        e.preventDefault()
        if (!url || !key) {
            toast.error('URL and Key are required')
            return
        }

        setTesting(true)
        try {
            // Save temporarily to test
            saveSupabaseConfig(url, key)

            // Verify connection
            const connected = await checkConnection()

            if (connected) {
                toast.success('Neural Link Established 🟢')
                onClose()
            } else {
                toast.error('Connection Failed. Check credentials.')
            }
        } catch (err) {
            toast.error('Connection Error: ' + err.message)
        } finally {
            setTesting(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={onClose}
            />

            <div className="relative panel w-full max-w-md bg-gray-900 border border-cyan-500/30 p-6 shadow-2xl animate-fade-in">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-cyan-400 glow-cyan flex items-center gap-2">
                        <span>☁️</span> Uplink Configuration
                    </h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-white">×</button>
                </div>

                <div className="mb-6 text-sm text-gray-400 leading-relaxed">
                    Connect your own <strong>Supabase</strong> backend to enable:
                    <ul className="list-disc pl-5 mt-2 space-y-1 text-xs">
                        <li>Cross-device Sync</li>
                        <li>Long-term Vector Memory</li>
                        <li>Knowledge Graph ("The Cortex")</li>
                    </ul>
                </div>

                <form onSubmit={handleConnect} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-cyan-500 uppercase tracking-widest mb-1">
                            Project URL
                        </label>
                        <input
                            type="text"
                            value={url}
                            onChange={e => setUrl(e.target.value)}
                            placeholder="https://xyz.supabase.co"
                            className="w-full bg-black/40 border border-gray-700 rounded p-2 text-sm text-gray-300 font-mono focus:border-cyan-500/50 focus:outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-cyan-500 uppercase tracking-widest mb-1">
                            Anon Key
                        </label>
                        <input
                            type="password"
                            value={key}
                            onChange={e => setKey(e.target.value)}
                            placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI..."
                            className="w-full bg-black/40 border border-gray-700 rounded p-2 text-sm text-gray-300 font-mono focus:border-cyan-500/50 focus:outline-none"
                        />
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="text-sm text-gray-500 hover:text-white px-3 py-2"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={testing}
                            className="btn-primary px-6 py-2 flex items-center gap-2 text-sm"
                        >
                            {testing ? 'Verifying...' : 'Establish Link'}
                        </button>
                    </div>
                </form>

                <div className="mt-4 pt-4 border-t border-gray-800 text-[10px] text-center text-gray-600">
                    Your credentials are stored locally in your browser.
                </div>
            </div>
        </div>
    )
}
