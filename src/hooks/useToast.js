import { useContext } from 'react'
import { ToastContext } from '../contexts/ToastContext'

// Hook to use toasts - separated for Fast Refresh compatibility
export function useToast() {
    const context = useContext(ToastContext)
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider')
    }
    return context
}
