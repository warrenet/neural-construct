/**
 * SidebarSection - Reusable labeled section container for sidebar controls
 * Provides consistent styling, optional tooltips, and collapsible functionality
 */
import { useState } from 'react'

export default function SidebarSection({
    title,
    icon,
    children,
    tooltip,
    collapsible = false,
    defaultCollapsed = false,
    badge
}) {
    const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed)

    return (
        <div className="space-y-3">
            {/* Section Header */}
            <div
                className={`flex items-center justify-between ${collapsible ? 'cursor-pointer group' : ''}`}
                onClick={collapsible ? () => setIsCollapsed(!isCollapsed) : undefined}
                title={tooltip}
            >
                <div className="flex items-center gap-2">
                    {icon && <span className="text-sm opacity-60">{icon}</span>}
                    <span className="text-xs text-gray-500 uppercase tracking-wider font-medium">
                        {title}
                    </span>
                    {badge && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-400/10 text-cyan-400 border border-cyan-400/30">
                            {badge}
                        </span>
                    )}
                </div>

                {collapsible && (
                    <span className={`text-gray-600 text-xs transition-transform duration-200 group-hover:text-gray-400 ${isCollapsed ? '' : 'rotate-180'}`}>
                        ▼
                    </span>
                )}
            </div>

            {/* Section Content */}
            <div className={`transition-all duration-200 overflow-hidden ${isCollapsed ? 'max-h-0 opacity-0' : 'max-h-[1000px] opacity-100'}`}>
                {children}
            </div>

            {/* Separator Line */}
            <div className="border-b border-gray-800/50" />
        </div>
    )
}

/**
 * SidebarDivider - Simple visual separator between sections
 */
export function SidebarDivider({ label }) {
    return (
        <div className="flex items-center gap-3 py-2">
            <div className="h-px bg-gray-800 flex-1" />
            {label && <span className="text-[10px] text-gray-600 uppercase tracking-widest">{label}</span>}
            <div className="h-px bg-gray-800 flex-1" />
        </div>
    )
}
