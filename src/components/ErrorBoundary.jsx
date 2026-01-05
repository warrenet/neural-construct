import React from 'react'

export class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props)
        this.state = { hasError: false, error: null, errorInfo: null }
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error }
    }

    componentDidCatch(error, errorInfo) {
        console.error('ErrorBoundary caught error:', error, errorInfo)
        this.setState({ errorInfo })
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="fixed inset-0 bg-black text-red-500 p-10 font-mono overflow-auto z-50">
                    <h1 className="text-2xl font-bold mb-4">CRITICAL SYSTEM FAILURE</h1>
                    <div className="bg-red-900/20 p-4 border border-red-500/50 rounded mb-4">
                        <h2 className="text-xl">{this.state.error?.toString()}</h2>
                    </div>
                    <pre className="text-xs text-gray-400 whitespace-pre-wrap">
                        {this.state.errorInfo?.componentStack}
                    </pre>
                </div>
            )
        }

        return this.props.children
    }
}
