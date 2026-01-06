/**
 * Model definitions for OpenRouter API
 * Updated January 2026 - https://openrouter.ai/models
 */

// Free models always available
export const FREE_MODELS = [
    { id: 'meta-llama/llama-4-maverick:free', name: 'Llama 4 Maverick', provider: 'Meta', tier: 'free' },
    { id: 'meta-llama/llama-4-scout:free', name: 'Llama 4 Scout', provider: 'Meta', tier: 'free' },
    { id: 'mistralai/mistral-small-3.1-24b-instruct:free', name: 'Mistral Small 3.1', provider: 'Mistral', tier: 'free' },
    { id: 'google/gemma-3-27b-it:free', name: 'Gemma 3 27B', provider: 'Google', tier: 'free' },
    { id: 'deepseek/deepseek-chat-v3-0324:free', name: 'DeepSeek V3', provider: 'DeepSeek', tier: 'free' },
    { id: 'qwen/qwen3-32b:free', name: 'Qwen 3 32B', provider: 'Qwen', tier: 'free' }
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
