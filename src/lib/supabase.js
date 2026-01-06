import { createClient } from '@supabase/supabase-js'

// Key for storing credentials in localStorage (user-provided)
const STORAGE_KEY = 'neural_supabase_config'

let supabase = null

export function getSupabaseConfig() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY)
        return stored ? JSON.parse(stored) : null
    } catch {
        return null
    }
}

export function saveSupabaseConfig(url, key) {
    if (!url || !key) return
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ url, key }))
    initializeSupabase()
}

export function clearSupabaseConfig() {
    localStorage.removeItem(STORAGE_KEY)
    supabase = null
}

export function initializeSupabase() {
    const config = getSupabaseConfig()
    // Also check env vars for easier dev
    const envUrl = import.meta.env.VITE_SUPABASE_URL
    const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY

    const url = config?.url || envUrl
    const key = config?.key || envKey

    if (url && key) {
        supabase = createClient(url, key)
        return true
    }
    return false
}

export function getSupabase() {
    if (!supabase) initializeSupabase()
    return supabase
}

// Auth Helpers
export async function signInWithEmail(email) {
    const sb = getSupabase()
    if (!sb) throw new Error('Cloud Disconnected')
    return await sb.auth.signInWithOtp({ email })
}

export async function signOut() {
    const sb = getSupabase()
    if (!sb) return
    return await sb.auth.signOut()
}

export async function getSession() {
    const sb = getSupabase()
    if (!sb) return null
    const { data } = await sb.auth.getSession()
    return data.session
}

// Data Sync Helpers (Placeholders)
export async function syncMemory(localData) {
    // TODO: Implement sync logic
    console.log('Syncing to cloud:', localData)
}
