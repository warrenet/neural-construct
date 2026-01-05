import { get, set, del } from 'idb-keyval'

export const VAULT_KEY = 'neural-construct-api-key'

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

export async function storeKey(apiKey) {
    await set(VAULT_KEY, obfuscate(apiKey))
}

export async function getStoredKey() {
    const stored = await get(VAULT_KEY)
    if (stored) {
        return deobfuscate(stored)
    }
    return null
}

export async function clearVault() {
    await del(VAULT_KEY)
}
