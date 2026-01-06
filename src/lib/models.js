/**
 * Model definitions for OpenRouter API
 * Updated January 2026 - https://openrouter.ai/models
 */

// Free models always available
export const FREE_MODELS = [
    { id: 'google/gemini-2.0-flash-exp:free', name: 'Gemini 2.0 Flash Exp', provider: 'Google', tier: 'free' },
    { id: 'meta-llama/llama-3.2-11b-vision-instruct:free', name: 'Llama 3.2 11B', provider: 'Meta', tier: 'free' },
    { id: 'huggingfaceh4/zephyr-7b-beta:free', name: 'Zephyr 7B Beta', provider: 'HuggingFace', tier: 'free' },
    { id: 'mistralai/mistral-7b-instruct:free', name: 'Mistral 7B', provider: 'Mistral', tier: 'free' },
    { id: 'microsoft/phi-3-mini-128k-instruct:free', name: 'Phi-3 Mini', provider: 'Microsoft', tier: 'free' },
]

// Curated paid tiers
export const PAID_MODELS = [
    { id: 'anthropic/claude-sonnet-4', name: 'Claude Sonnet 4', provider: 'Anthropic', tier: 'top', cost: '~$3/1M' },
    { id: 'google/gemini-2.5-flash-preview', name: 'Gemini 2.5 Flash', provider: 'Google', tier: 'budget', cost: '~$0.15/1M' },
    { id: 'openai/gpt-4.1-mini', name: 'GPT-4.1 Mini', provider: 'OpenAI', tier: 'mid', cost: '~$0.40/1M' }
]

// All models combined
export const ALL_MODELS = [...FREE_MODELS, ...PAID_MODELS]

// Tier display labels
export const TIER_LABELS = {
    free: { label: '🆓 FREE', color: 'text-green-400' },
    top: { label: '💎 TOP', color: 'text-purple-400' },
    mid: { label: '⚖️ MID', color: 'text-blue-400' },
    budget: { label: '💰 BUDGET', color: 'text-yellow-400' }
}

// Default configuration
export function getDefaultModelConfig() {
    return {
        defaultModel: FREE_MODELS[0].id,
        useDefault: true,
        personaModels: {}
    }
}
