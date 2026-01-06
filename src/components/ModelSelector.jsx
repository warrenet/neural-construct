/**
 * ModelSelector - UI component for selecting AI models
 * Model definitions and persistence are in src/lib/models.js and src/lib/modelConfig.js
 */
import { useState } from 'react'
import { FREE_MODELS, PAID_MODELS, TIER_LABELS } from '../lib/models'

export default function ModelSelector({ config, onChange, disabled }) {
    const [_showCustomize, setShowCustomize] = useState(!config.useDefault)

    const handleModeChange = (useDefault) => {
        setShowCustomize(!useDefault)
        onChange({ ...config, useDefault })
    }

    const handleDefaultChange = (modelId) => {
        onChange({ ...config, defaultModel: modelId })
    }

    const handlePersonaChange = (personaId, modelId) => {
        onChange({
            ...config,
            personaModels: { ...config.personaModels, [personaId]: modelId }
        })
    }

    return (
        <div className="space-y-4">
            <div className="text-xs text-gray-500 uppercase tracking-wider">
                Model Configuration
            </div>

            {/* Toggle: Default vs Custom */}
            <div className="flex gap-2">
                <button
                    onClick={() => handleModeChange(true)}
                    disabled={disabled}
                    className={`flex-1 py-2 px-3 rounded text-sm transition-all ${config.useDefault
                        ? 'bg-cyan-400/20 border border-cyan-400/50 text-cyan-400'
                        : 'bg-gray-800 border border-gray-700 text-gray-400'
                        }`}
                >
                    Same for All
                </button>
                <button
                    onClick={() => handleModeChange(false)}
                    disabled={disabled}
                    className={`flex-1 py-2 px-3 rounded text-sm transition-all ${!config.useDefault
                        ? 'bg-cyan-400/20 border border-cyan-400/50 text-cyan-400'
                        : 'bg-gray-800 border border-gray-700 text-gray-400'
                        }`}
                >
                    Per Agent
                </button>
            </div>

            {/* Default Model Selector */}
            {config.useDefault && (
                <div>
                    <label className="block text-sm text-gray-400 mb-2">Default Model</label>
                    <ModelDropdown
                        value={config.defaultModel}
                        onChange={handleDefaultChange}
                        disabled={disabled}
                    />
                </div>
            )}

            {/* Per-Persona Selectors */}
            {!config.useDefault && (
                <div className="space-y-3">
                    <PerPersonaSelector
                        label="🔵 Architect"
                        personaId="architect"
                        value={config.personaModels.architect}
                        onChange={handlePersonaChange}
                        disabled={disabled}
                    />
                    <PerPersonaSelector
                        label="🟢 Vibe Coder"
                        personaId="vibe_coder"
                        value={config.personaModels.vibe_coder}
                        onChange={handlePersonaChange}
                        disabled={disabled}
                    />
                    <PerPersonaSelector
                        label="🔴 Strategist"
                        personaId="strategist"
                        value={config.personaModels.strategist}
                        onChange={handlePersonaChange}
                        disabled={disabled}
                    />
                </div>
            )}
        </div>
    )
}

function PerPersonaSelector({ label, personaId, value, onChange, disabled }) {
    return (
        <div className="flex items-center gap-3">
            <span className="text-sm w-28">{label}</span>
            <div className="flex-1">
                <ModelDropdown
                    value={value}
                    onChange={(modelId) => onChange(personaId, modelId)}
                    disabled={disabled}
                />
            </div>
        </div>
    )
}

function ModelDropdown({ value, onChange, disabled }) {
    return (
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-sm"
        >
            <optgroup label="🆓 Free Models">
                {FREE_MODELS.map(m => (
                    <option key={m.id} value={m.id}>
                        {m.name} ({m.provider})
                    </option>
                ))}
            </optgroup>
            <optgroup label="💳 Paid Models">
                {PAID_MODELS.map(m => (
                    <option key={m.id} value={m.id}>
                        {m.name} - {TIER_LABELS[m.tier].label} {m.cost}
                    </option>
                ))}
            </optgroup>
        </select>
    )
}
