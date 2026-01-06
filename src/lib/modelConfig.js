/**
 * Model configuration persistence utilities
 * Handles loading/saving model config from IndexedDB with migration logic
 */
import { get, set } from 'idb-keyval'
import { FREE_MODELS, ALL_MODELS, getDefaultModelConfig } from './models'

const STORAGE_KEY = 'neural-construct-model-config'

// List of deprecated model IDs to migrate from
const DEPRECATED_MODELS = [
    'meta-llama/llama-3.1-8b-instruct:free',
    'mistralai/mistral-7b-instruct:free',
    'qwen/qwen-2-7b-instruct:free',
    'nousresearch/hermes-3-llama-3.1-405b:free',
    'google/gemma-2-9b-it:free',
    'anthropic/claude-3.5-sonnet',
    'google/gemini-flash-1.5',
    'openai/gpt-4o-mini'
]

// Check if model ID is valid (exists in current list)
function isValidModel(modelId) {
    return ALL_MODELS.some(m => m.id === modelId)
}

/**
 * Load model configuration from IndexedDB with automatic migration
 */
export async function loadModelConfig() {
    try {
        const stored = await get(STORAGE_KEY)
        if (stored) {
            let modified = false
            const defaultFree = FREE_MODELS[0].id

            // Migration: Check Default
            if (stored.defaultModel && (!isValidModel(stored.defaultModel) || DEPRECATED_MODELS.includes(stored.defaultModel))) {
                stored.defaultModel = defaultFree
                modified = true
            }

            // Migration: Check Personas
            if (stored.personaModels) {
                for (const [key, value] of Object.entries(stored.personaModels)) {
                    if (!isValidModel(value) || DEPRECATED_MODELS.includes(value)) {
                        stored.personaModels[key] = defaultFree
                        modified = true
                    }
                }
            }

            if (modified) {
                await set(STORAGE_KEY, stored)
                console.log('Migrated model config to new model IDs')
            }
            return { ...getDefaultModelConfig(), ...stored }
        }
    } catch (err) {
        console.error('Failed to load model config:', err)
    }
    return getDefaultModelConfig()
}

/**
 * Save model configuration to IndexedDB
 */
export async function saveModelConfig(config) {
    await set(STORAGE_KEY, config)
}
