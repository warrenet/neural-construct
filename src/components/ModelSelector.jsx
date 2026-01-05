import { useState, useEffect } from 'react'
import { get, set } from 'idb-keyval'

// Free models always available
export const FREE_MODELS = [
    { id: 'google/gemma-2-9b-it:free', name: 'Gemma 2 9B', provider: 'Google', tier: 'free' },
    { id: 'meta-llama/llama-3.1-8b-instruct:free', name: 'Llama 3.1 8B', provider: 'Meta', tier: 'free' },
    { id: 'mistralai/mistral-7b-instruct:free', name: 'Mistral 7B', provider: 'Mistral', tier: 'free' },
    { id: 'qwen/qwen-2-7b-instruct:free', name: 'Qwen 2 7B', provider: 'Qwen', tier: 'free' },
    { id: 'nousresearch/hermes-3-llama-3.1-405b:free', name: 'Hermes 3 405B', provider: 'Nous', tier: 'free' }
]

// Curated paid tiers
export const PAID_MODELS = [
    { id: 'anthropic/claude-3.5-sonnet', name: 'Claude 3.5 Sonnet', provider: 'Anthropic', tier: 'top', cost: '~$3/1M' },
    { id: 'google/gemini-flash-1.5', name: 'Gemini Flash 1.5', provider: 'Google', tier: 'budget', cost: '~$0.07/1M' },
    { id: 'openai/gpt-4o-mini', name: 'GPT-4o Mini', provider: 'OpenAI', tier: 'mid', cost: '~$0.15/1M' }
]

export const ALL_MODELS = [...FREE_MODELS, ...PAID_MODELS]

const TIER_LABELS = {
    free: { label: '🆓 FREE', color: 'text-green-400' },
    top: { label: '💎 TOP', color: 'text-purple-400' },
    mid: { label: '⚖️ MID', color: 'text-blue-400' },
    budget: { label: '💰 BUDGET', color: 'text-yellow-400' }
}

const STORAGE_KEY = 'neural-construct-model-config'

export default function ModelSelector({ config, onChange, disabled }) {
    const [showCustomize, setShowCustomize] = useState(!config.useDefault)

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

// Default configuration
export function getDefaultModelConfig() {
    return {
        useDefault: true,
        defaultModel: FREE_MODELS[0].id,
        personaModels: {
            architect: FREE_MODELS[0].id,
            vibe_coder: FREE_MODELS[0].id,
            strategist: FREE_MODELS[0].id
        }
    }
}

// Persistence helpers
export async function loadModelConfig() {
    const stored = await get(STORAGE_KEY)
    return stored || getDefaultModelConfig()
}

export async function saveModelConfig(config) {
    await set(STORAGE_KEY, config)
}
