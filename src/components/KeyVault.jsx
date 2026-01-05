import { useState } from 'react'
import { set, get } from 'idb-keyval'

const VAULT_KEY = 'neural-construct-api-key'

// Simple obfuscation (not true encryption, but keeps key out of plain localStorage)
function obfuscate(key) {
    return btoa(key.split('').reverse().join(''))
}

function deobfuscate(data) {
    try {
        return atob(data).split('').reverse().join('')
    } catch {
        return null
    }
}

export default function KeyVault({ onUnlock }) {
    const [apiKey, setApiKey] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleUnlock = async () => {
        if (!apiKey.trim()) {
            setError('API key is required')
            return
        }

        if (!apiKey.startsWith('sk-or-')) {
            setError('Invalid OpenRouter key format (should start with sk-or-)')
            return
        }

        setLoading(true)
        setError('')

        try {
            // Store obfuscated key in IndexedDB
            await set(VAULT_KEY, obfuscate(apiKey))
            onUnlock(apiKey)
        } catch (err) {
            setError('Failed to store key: ' + err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 bg-[#0a0a0a] z-40 flex items-center justify-center">
            <div className="w-full max-w-md p-6">
                <div className="text-center mb-8">
                    <div className="text-6xl mb-4">🔐</div>
                    <h2 className="text-xl text-cyan-400 glow-cyan font-bold tracking-widest">
                        THE VAULT
                    </h2>
                    <p className="text-gray-500 text-sm mt-2">
                        Enter your OpenRouter API key to unlock
                    </p>
                </div>

                <div className="panel p-6 space-y-4">
                    <div>
                        <label className="block text-sm text-gray-400 mb-2">
                            OpenRouter API Key
                        </label>
                        <input
                            type="password"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleUnlock()}
                            placeholder="sk-or-..."
                            className="w-full"
                            autoFocus
                        />
                    </div>

                    {error && (
                        <div className="text-red-400 text-sm bg-red-400/10 p-3 rounded">
                            ⚠ {error}
                        </div>
                    )}

                    <button
                        onClick={handleUnlock}
                        disabled={loading}
                        className="btn-primary w-full"
                    >
                        {loading ? 'UNLOCKING...' : 'UNLOCK VAULT'}
                    </button>

                    <div className="text-center text-xs text-gray-600 mt-4">
                        <p>🔒 Key is stored locally only</p>
                        <p>Never transmitted to our servers</p>
                    </div>

                    <div className="text-center mt-4">
                        <a
                            href="https://openrouter.ai/keys"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-cyan-400 text-sm hover:underline"
                        >
                            Get an OpenRouter API key →
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}

// Helper to retrieve stored key
export async function getStoredKey() {
    const stored = await get(VAULT_KEY)
    if (stored) {
        return deobfuscate(stored)
    }
    return null
}

// Helper to clear stored key
export async function clearVault() {
    const { del } = await import('idb-keyval')
    await del(VAULT_KEY)
}
