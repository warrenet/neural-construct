import { createContext, useContext, useState, useEffect } from 'react'
import { getSupabase, getSession, initializeSupabase } from '../lib/supabase'

const AuthContext = createContext({})

export function useAuth() {
    return useContext(AuthContext)
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [isConnected, setIsConnected] = useState(false)
    const [loading, setLoading] = useState(true)

    // 1. Connection Initializer (callable manually)
    const checkConnection = async () => {
        setLoading(true)
        const initialized = initializeSupabase()
        setIsConnected(initialized)

        if (initialized) {
            const session = await getSession()
            setUser(session?.user ?? null)
        }
        setLoading(false)
        return initialized
    }

    // 2. Initial check on mount
    useEffect(() => {
        checkConnection()
    }, [])

    // 3. Auth Listener (depends on connection status)
    useEffect(() => {
        if (!isConnected) return

        const sb = getSupabase()
        if (!sb) return

        const { data: { subscription } } = sb.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null)
        })

        return () => {
            subscription.unsubscribe()
        }
    }, [isConnected])

    const value = {
        user,
        isConnected,
        loading,
        checkConnection
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}
