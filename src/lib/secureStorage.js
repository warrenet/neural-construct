import { get, set, del } from 'idb-keyval'

export const VAULT_KEY = 'neural-construct-api-key'
const SALT_KEY = 'neural-construct-salt'

// Generate a cryptographic salt for key derivation
async function getOrCreateSalt() {
    let salt = await get(SALT_KEY)
    if (!salt) {
        salt = crypto.getRandomValues(new Uint8Array(16))
        await set(SALT_KEY, salt)
    }
    return salt
}

// Derive an encryption key from a passphrase using PBKDF2
async function deriveKey(salt) {
    // Use a combination of origin and user agent as the passphrase
    // This ties the encryption to this specific browser/device
    const passphrase = `${window.location.origin}:${navigator.userAgent}:neural-construct-vault`
    const encoder = new TextEncoder()

    const keyMaterial = await crypto.subtle.importKey(
        'raw',
        encoder.encode(passphrase),
        'PBKDF2',
        false,
        ['deriveKey']
    )

    return crypto.subtle.deriveKey(
        {
            name: 'PBKDF2',
            salt: salt,
            iterations: 100000,
            hash: 'SHA-256'
        },
        keyMaterial,
        { name: 'AES-GCM', length: 256 },
        false,
        ['encrypt', 'decrypt']
    )
}

// Encrypt the API key using AES-GCM
async function encrypt(plaintext) {
    const salt = await getOrCreateSalt()
    const key = await deriveKey(salt)
    const encoder = new TextEncoder()
    const iv = crypto.getRandomValues(new Uint8Array(12))

    const ciphertext = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        key,
        encoder.encode(plaintext)
    )

    // Combine IV and ciphertext for storage
    const combined = new Uint8Array(iv.length + ciphertext.byteLength)
    combined.set(iv)
    combined.set(new Uint8Array(ciphertext), iv.length)

    return combined
}

// Decrypt the API key
async function decrypt(combined) {
    if (!combined || combined.length < 13) return null

    try {
        const salt = await get(SALT_KEY)
        if (!salt) return null

        const key = await deriveKey(salt)
        const iv = combined.slice(0, 12)
        const ciphertext = combined.slice(12)

        const decrypted = await crypto.subtle.decrypt(
            { name: 'AES-GCM', iv },
            key,
            ciphertext
        )

        return new TextDecoder().decode(decrypted)
    } catch (err) {
        console.error('Decryption failed:', err)
        // Clear corrupted data
        await del(VAULT_KEY)
        return null
    }
}

export async function storeKey(apiKey) {
    const encrypted = await encrypt(apiKey)
    await set(VAULT_KEY, encrypted)
}

export async function getStoredKey() {
    const stored = await get(VAULT_KEY)
    if (stored) {
        return decrypt(stored)
    }
    return null
}

export async function clearVault() {
    await del(VAULT_KEY)
    await del(SALT_KEY)
}
