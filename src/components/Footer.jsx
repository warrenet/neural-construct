// Footer with Warrenet credit

export default function Footer() {
    return (
        <footer className="border-t border-gray-800/50 py-3 px-4">
            <div className="max-w-6xl mx-auto flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-gray-600">
                    <span className="text-cyan-400/50">◢</span>
                    <span>CONSTRUCT-01</span>
                    <span className="text-gray-700">|</span>
                    <span>v1.0.0</span>
                </div>

                <div className="flex items-center gap-2 text-gray-500 hover:text-cyan-400 transition-colors group">
                    <span className="text-gray-600 group-hover:text-cyan-400/50 transition-colors">⌬</span>
                    <span>Engineered by</span>
                    <a
                        href="https://github.com/warrenet"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-cyan-400 hover:text-cyan-300 transition-colors glow-cyan"
                    >
                        WARRENET
                    </a>
                    <span className="text-gray-600 group-hover:text-cyan-400/50 transition-colors">◣</span>
                </div>
            </div>
        </footer>
    )
}

// Compact version for sidebars
export function CreditBadge() {
    return (
        <div className="text-center py-2">
            <a
                href="https://github.com/warrenet"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-gray-600 hover:text-cyan-400 transition-colors"
            >
                <span>◢◣</span>
                <span>WARRENET</span>
            </a>
        </div>
    )
}
