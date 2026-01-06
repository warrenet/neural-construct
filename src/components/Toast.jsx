import { useState, useMemo, useCallback, useRef, useEffect } from 'react'
import { ToastContext } from '../contexts/ToastContext'

// Toast types with styling
const TOAST_TYPES = {
    success: {
        icon: '✓',
        bg: 'bg-green-400/10',
        border: 'border-green-400/50',
        text: 'text-green-400',
        glow: 'shadow-green-400/20'
    },
    info: {
        icon: '💡',
        bg: 'bg-cyan-400/10',
        border: 'border-cyan-400/50',
        text: 'text-cyan-400',
        glow: 'shadow-cyan-400/20'
    },
    tip: {
        icon: '🎯',
        bg: 'bg-purple-400/10',
        border: 'border-purple-400/50',
        text: 'text-purple-400',
        glow: 'shadow-purple-400/20'
    },
    warning: {
        icon: '⚠️',
        bg: 'bg-yellow-400/10',
        border: 'border-yellow-400/50',
        text: 'text-yellow-400',
        glow: 'shadow-yellow-400/20'
    },
    error: {
        icon: '✗',
        bg: 'bg-red-400/10',
        border: 'border-red-400/50',
        text: 'text-red-400',
        glow: 'shadow-red-400/20'
    }
}

// Toast Provider Component
export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([])
    const timers = useRef({})

    const removeToast = useCallback((id) => {
        // Clear any pending timer for this toast
        if (timers.current[id]) {
            clearTimeout(timers.current[id])
            delete timers.current[id]
        }
        setToasts(prev => prev.filter(t => t.id !== id))
    }, [])

    const addToast = useCallback((message, type = 'info', duration = 4000) => {
        const id = Date.now() + Math.random()
        setToasts(prev => [...prev, { id, message, type, duration }])

        if (duration > 0) {
            timers.current[id] = setTimeout(() => {
                removeToast(id)
            }, duration)
        }

        return id
    }, [removeToast])

    // Convenience methods - Memoized to prevent infinite loops
    const toast = useMemo(() => ({
        success: (msg, duration) => addToast(msg, 'success', duration),
        info: (msg, duration) => addToast(msg, 'info', duration),
        tip: (msg, duration) => addToast(msg, 'tip', duration ?? 6000),
        warning: (msg, duration) => addToast(msg, 'warning', duration),
        error: (msg, duration) => addToast(msg, 'error', duration ?? 6000)
    }), [addToast])

    const contextValue = useMemo(() => ({
        toasts, addToast, removeToast, toast
    }), [toasts, addToast, removeToast, toast])

    return (
        <ToastContext.Provider value={contextValue}>
            {children}
            <ToastContainer toasts={toasts} onDismiss={removeToast} />
        </ToastContext.Provider>
    )
}

// Toast Container
function ToastContainer({ toasts, onDismiss }) {
    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
            {toasts.map((toast) => (
                <div key={toast.id} className="pointer-events-auto">
                    <Toast toast={toast} onDismiss={() => onDismiss(toast.id)} />
                </div>
            ))}
        </div>
    )
}

// Individual Toast
function Toast({ toast, onDismiss }) {
    const [isExiting, setIsExiting] = useState(false)
    const style = TOAST_TYPES[toast.type] || TOAST_TYPES.info
    const timeoutRef = useRef(null)

    useEffect(() => {
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current)
        }
    }, [])

    const handleDismiss = () => {
        if (isExiting) return
        setIsExiting(true)
        timeoutRef.current = setTimeout(onDismiss, 200)
    }

    return (
        <div
            className={`
        flex items-start gap-3 p-4 rounded-lg border backdrop-blur-sm
        ${style.bg} ${style.border} shadow-lg ${style.glow}
        transition-all duration-200
        ${isExiting ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'}
        animate-slide-in
      `}
            style={{ animation: 'slideIn 0.3s ease' }}
            role="alert"
        >
            <span className={`text-lg ${style.text}`}>{style.icon}</span>
            <div className="flex-1">
                <p className={`text-sm ${style.text}`}>{toast.message}</p>
            </div>
            <button
                onClick={handleDismiss}
                className="text-gray-500 hover:text-white transition-colors p-1"
                aria-label="Close"
            >
                ×
            </button>
        </div>
    )
}

export default ToastProvider
