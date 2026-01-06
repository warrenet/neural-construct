import { useState, useMemo } from 'react'
import {
    TEMPLATE_CATEGORIES,
    getAllTemplates,
    getRecommendedConfig,
    extractTemplateVariables,
    applyTemplateVariables
} from '../lib/templates'

export default function TemplateSelector({ onSelect, onClose }) {
    const [selectedCategory, setSelectedCategory] = useState('all')
    const [search, setSearch] = useState('')
    const [hoveredTemplate, setHoveredTemplate] = useState(null)
    const [variableForm, setVariableForm] = useState(null) // {template, variables, values}

    const templates = useMemo(() => {
        let all = getAllTemplates()

        if (selectedCategory !== 'all') {
            all = all.filter(t => t.category === selectedCategory)
        }

        if (search.trim()) {
            const q = search.toLowerCase()
            all = all.filter(t =>
                t.name.toLowerCase().includes(q) ||
                t.description?.toLowerCase().includes(q) ||
                t.id.toLowerCase().includes(q)
            )
        }

        return all
    }, [selectedCategory, search])

    // Check if template has variables, show form if so
    const handleSelect = (template) => {
        const variables = extractTemplateVariables(template.prompt)

        if (variables.length > 0) {
            // Show variable form first
            const initialValues = { INPUT: '' }
            variables.forEach(v => { initialValues[v.name] = '' })
            setVariableForm({ template, variables, values: initialValues })
        } else {
            // No custom variables, just apply with INPUT placeholder
            const config = getRecommendedConfig(template)
            onSelect(template, config)
            onClose()
        }
    }

    // Apply variables and proceed
    const handleVariableSubmit = () => {
        if (!variableForm) return

        const { template, values } = variableForm
        const filledPrompt = applyTemplateVariables(template.prompt, values)
        const config = getRecommendedConfig(template)

        // Create a modified template with filled prompt
        const filledTemplate = { ...template, prompt: filledPrompt }
        onSelect(filledTemplate, config)
        onClose()
    }

    const handleVariableChange = (varName, value) => {
        setVariableForm(prev => ({
            ...prev,
            values: { ...prev.values, [varName]: value }
        }))
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Search Modal */}
            <div className="relative panel w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden animate-slide-up shadow-2xl shadow-cyan-900/20">

                {/* Header */}
                <div className="p-6 border-b border-gray-800 flex flex-col gap-4 bg-gray-900/50">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <span className="text-3xl">📋</span>
                            <div>
                                <h2 className="text-xl font-bold text-cyan-400 glow-cyan">
                                    Neural Template Library
                                </h2>
                                <p className="text-xs text-gray-400 uppercase tracking-widest">
                                    Select a protocol to execute
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-white transition-colors text-2xl"
                        >
                            ×
                        </button>
                    </div>

                    <div className="flex gap-4">
                        <div className="relative flex-1">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">🔍</span>
                            <input
                                type="text"
                                placeholder="Search protocols..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-10 bg-black/30 border-gray-700 focus:border-cyan-500/50"
                                autoFocus
                            />
                        </div>
                    </div>

                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
                        <button
                            onClick={() => setSelectedCategory('all')}
                            className={`whitespace-nowrap px-3 py-1.5 rounded text-xs font-medium transition-all ${selectedCategory === 'all'
                                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                                : 'bg-gray-800/50 text-gray-400 hover:text-white border border-transparent'
                                }`}
                        >
                            All Protocols ({getAllTemplates().length})
                        </button>
                        {TEMPLATE_CATEGORIES.map(cat => {
                            const count = getAllTemplates().filter(t => t.category === cat.id).length
                            return (
                                <button
                                    key={cat.id}
                                    onClick={() => setSelectedCategory(cat.id)}
                                    className={`whitespace-nowrap px-3 py-1.5 rounded text-xs font-medium transition-all ${selectedCategory === cat.id
                                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                                        : 'bg-gray-800/50 text-gray-400 hover:text-white border border-transparent'
                                        }`}
                                >
                                    {cat.name} ({count})
                                </button>
                            )
                        })}
                    </div>
                </div>

                {/* Variable Form Overlay */}
                {variableForm && (
                    <div className="absolute inset-0 z-20 bg-gray-900/95 backdrop-blur-xl flex flex-col animate-fade-in">
                        <div className="p-6 border-b border-gray-800 bg-gray-900 shadow-2xl z-10 flex items-center justify-between">
                            <div>
                                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                    <span className="text-cyan-400">⚡</span> Customize Protocol
                                </h3>
                                <p className="text-sm text-gray-400">
                                    Configure variables for {variableForm.template.name}
                                </p>
                            </div>
                            <button
                                onClick={() => setVariableForm(null)}
                                className="text-gray-500 hover:text-white"
                            >
                                ×
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-8 max-w-2xl mx-auto w-full space-y-6">
                            {/* Standard Input */}
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-cyan-400 uppercase tracking-widest">
                                    Main Input
                                </label>
                                <textarea
                                    value={variableForm.values.INPUT}
                                    onChange={(e) => handleVariableChange('INPUT', e.target.value)}
                                    placeholder="Enter the main topic or content..."
                                    className="w-full bg-black/40 border border-gray-700 rounded p-4 h-32 text-gray-200 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all font-mono text-sm leading-relaxed"
                                    autoFocus
                                />
                            </div>

                            {/* Custom Variables */}
                            {variableForm.variables.map(v => (
                                <div key={v.name} className="space-y-2">
                                    <label className="text-sm font-bold text-purple-400 uppercase tracking-widest">
                                        {v.label}
                                    </label>
                                    <input
                                        type="text"
                                        value={variableForm.values[v.name]}
                                        onChange={(e) => handleVariableChange(v.name, e.target.value)}
                                        placeholder={v.placeholder}
                                        className="w-full bg-black/40 border border-gray-700 rounded p-3 text-gray-200 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 transition-all font-mono text-sm"
                                    />
                                </div>
                            ))}
                        </div>

                        <div className="p-6 border-t border-gray-800 bg-gray-900 flex justify-end gap-3">
                            <button
                                onClick={() => setVariableForm(null)}
                                className="px-6 py-2 rounded text-gray-400 hover:text-white transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleVariableSubmit}
                                disabled={!variableForm.values.INPUT.trim()}
                                className="btn-primary px-8 py-2 flex items-center gap-2"
                            >
                                <span>🚀</span> Launch Protocol
                            </button>
                        </div>
                    </div>
                )}

                {/* Content */}
                <div className="flex-1 flex overflow-hidden">

                    {/* List */}
                    <div className="w-[45%] overflow-y-auto border-r border-gray-800 p-2 space-y-2 bg-black/20">
                        {templates.length === 0 ? (
                            <div className="text-center p-10 text-gray-500 italic">
                                No templates found matching query.
                            </div>
                        ) : (
                            templates.map(template => (
                                <div
                                    key={template.id}
                                    onClick={() => handleSelect(template)}
                                    onMouseEnter={() => setHoveredTemplate(template)}
                                    className={`
                    group p-3 rounded cursor-pointer border transition-all duration-200 relative overflow-hidden
                    ${hoveredTemplate?.id === template.id
                                            ? 'bg-cyan-900/10 border-cyan-500/30 shadow-[inset_0_0_20px_rgba(6,182,212,0.05)]'
                                            : 'bg-gray-900/20 border-gray-800 hover:border-gray-700'
                                        }
                  `}
                                >
                                    <div className="flex items-start justify-between mb-1">
                                        <span className="font-bold text-gray-200 group-hover:text-cyan-300 transition-colors">
                                            {template.name}
                                        </span>
                                        <div className="flex gap-1">
                                            {template.costTier === 'free' && (
                                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-green-500/10 text-green-400 border border-green-500/30">
                                                    FREE
                                                </span>
                                            )}
                                            {template.costTier === 'premium' && (
                                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/30">
                                                    PREMIUM
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <p className="text-xs text-gray-500 line-clamp-2 mb-2">
                                        {template.description || 'No description available.'}
                                    </p>

                                    <div className="flex items-center gap-3 text-[10px] text-gray-600">
                                        <span className="flex items-center gap-1">
                                            <span className="opacity-50">MODE:</span>
                                            <span className="text-gray-400 uppercase">{template.recommendedMode}</span>
                                        </span>
                                        {template.useSwarm && (
                                            <span className="flex items-center gap-1 text-yellow-500/70">
                                                <span>🐝</span> SWARM
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Preview Panel */}
                    <div className="flex-1 bg-gray-900/30 p-6 overflow-y-auto relative">
                        {!hoveredTemplate ? (
                            <div className="h-full flex flex-col items-center justify-center text-gray-600 opacity-50">
                                <span className="text-6xl mb-4">📋</span>
                                <p>Hover over a template to preview</p>
                            </div>
                        ) : (
                            <div className="animate-fade-in space-y-6">
                                <div>
                                    <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
                                        {hoveredTemplate.name}
                                        <span className="text-xs px-2 py-1 bg-gray-800 rounded border border-gray-700 text-gray-400 font-mono">
                                            {hoveredTemplate.id}
                                        </span>
                                    </h3>
                                    <p className="text-gray-400 text-lg">
                                        {hoveredTemplate.description}
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <InfoBox label="Recommended Mode" value={hoveredTemplate.recommendedMode?.toUpperCase()} icon="🔀" />
                                    <InfoBox label="Persona" value={hoveredTemplate.recommendedPersona?.toUpperCase() || 'AUTO'} icon="👤" />
                                    {hoveredTemplate.useSwarm && (
                                        <InfoBox label="Swarm Architecture" value="ENABLED" icon="🐝" highlight />
                                    )}
                                    {hoveredTemplate.phases && (
                                        <InfoBox label="Phases" value={`${hoveredTemplate.phases.length} Steps`} icon="🔄" />
                                    )}
                                </div>

                                {hoveredTemplate.phases && (
                                    <div className="space-y-2">
                                        <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Execution Pipeline</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {hoveredTemplate.phases.map((phase, i) => (
                                                <div key={i} className="flex items-center">
                                                    <span className="px-3 py-1.5 bg-gray-800 rounded text-xs text-cyan-400 border border-gray-700">
                                                        {i + 1}. {phase}
                                                    </span>
                                                    {i < hoveredTemplate.phases.length - 1 && (
                                                        <span className="mx-2 text-gray-600">→</span>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Prompt Preview</h4>
                                    <div className="bg-black/50 p-4 rounded-lg border border-gray-800 font-mono text-xs text-gray-300 leading-relaxed whitespace-pre-wrap max-h-[400px] overflow-y-auto scrollbar-thin">
                                        {hoveredTemplate.prompt}
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-gray-800">
                                    <button
                                        onClick={() => handleSelect(hoveredTemplate)}
                                        className="btn-primary w-full py-3 flex items-center justify-center gap-2 text-base"
                                    >
                                        <span>🚀</span> Initialize {hoveredTemplate.name}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

function InfoBox({ label, value, icon, highlight }) {
    return (
        <div className={`
      p-3 rounded border flex items-center gap-3
      ${highlight
                ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-500'
                : 'bg-gray-800/50 border-gray-700 text-gray-300'}
    `}>
            <span className="text-xl">{icon}</span>
            <div>
                <div className="text-[10px] text-gray-500 uppercase">{label}</div>
                <div className="font-bold text-sm">{value}</div>
            </div>
        </div>
    )
}
