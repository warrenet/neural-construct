import { useEffect, useRef } from 'react'
import { get, set } from 'idb-keyval'

const ONBOARDING_KEY = 'neural-construct-onboarding'

// Onboarding tips shown in sequence
const TIPS = [
    {
        id: 'welcome',
        trigger: 'startup',
        message: 'Welcome to The Neural Construct! Click the ❓ button anytime for help.',
        delay: 2000
    },
    {
        id: 'council',
        trigger: 'startup',
        message: 'Select a Council member to shape how the AI responds. Each has a unique specialty.',
        delay: 6000
    },
    {
        id: 'modes',
        trigger: 'startup',
        message: 'Try different reasoning modes! MATRIX uses 3 parallel agents for complex problems.',
        delay: 12000
    },
    {
        id: 'swarm',
        trigger: 'swarm_enabled',
        message: '🐝 Swarm mode activated! All 3 Council members will collaborate in sequence.',
        delay: 0
    },
    {
        id: 'first_response',
        trigger: 'first_response',
        message: 'Response complete! Check the sidebar for response history.',
        delay: 500
    },
    {
        id: 'advanced_modes',
        trigger: 'advanced_mode_selected',
        message: 'Advanced mode selected! Watch the Pass Progress panel to track each reasoning step.',
        delay: 0
    },
    {
        id: 'free_models',
        trigger: 'model_changed',
        message: '💡 Tip: Free models are great for testing. Switch to paid models for complex tasks.',
        delay: 0
    },
    {
        id: 'keyboard',
        trigger: 'startup',
        message: 'Press Enter to send messages. Press Escape to close modals.',
        delay: 18000
    }
]

// Contextual tips that can appear randomly during use
const CONTEXTUAL_TIPS = [
    'Try RED TEAM mode to find security vulnerabilities in your code.',
    'RUBRIC mode auto-fixes anything scoring below 85%.',
    'SOCRATIC mode uses questions to dig deeper into problems.',
    'DEBATE mode is great for making tough decisions.',
    'Swarm mode chains all 3 agents: Architect → Coder → Strategist.',
    'Your API key is stored locally and never sent to our servers.',
    'DEEP mode shows the AI\'s thinking process with <thinking> tags.',
    'Use MATRIX mode for problems with multiple facets to consider.'
]

export function useOnboarding(toast) {
    const shownTips = useRef(new Set())
    const initialized = useRef(false)

    // Load seen tips from storage
    useEffect(() => {
        const loadSeen = async () => {
            const seen = await get(ONBOARDING_KEY)
            if (seen) {
                shownTips.current = new Set(seen)
            }
            initialized.current = true
        }
        loadSeen()
    }, [])

    // Save seen tips
    const markSeen = async (tipId) => {
        shownTips.current.add(tipId)
        await set(ONBOARDING_KEY, [...shownTips.current])
    }

    // Show tip if not seen before
    const showTip = (tipId) => {
        if (!initialized.current) return
        if (shownTips.current.has(tipId)) return

        const tip = TIPS.find(t => t.id === tipId)
        if (tip) {
            setTimeout(() => {
                toast.tip(tip.message)
                markSeen(tipId)
            }, tip.delay)
        }
    }

    // Show tips by trigger
    const triggerTips = (trigger) => {
        if (!initialized.current) return

        TIPS.filter(t => t.trigger === trigger).forEach(tip => {
            if (!shownTips.current.has(tip.id)) {
                setTimeout(() => {
                    toast.tip(tip.message)
                    markSeen(tip.id)
                }, tip.delay)
            }
        })
    }

    // Show a random contextual tip (10% chance when called)
    const maybeShowContextualTip = () => {
        if (Math.random() < 0.1) {
            const tip = CONTEXTUAL_TIPS[Math.floor(Math.random() * CONTEXTUAL_TIPS.length)]
            toast.tip(tip, 5000)
        }
    }

    // Reset onboarding (for testing)
    const resetOnboarding = async () => {
        shownTips.current = new Set()
        await set(ONBOARDING_KEY, [])
    }

    return {
        showTip,
        triggerTips,
        maybeShowContextualTip,
        resetOnboarding
    }
}

// Pre-built toast messages for common actions
export const TOAST_MESSAGES = {
    // Success messages
    keySaved: '🔐 API key saved securely',
    historyCleared: '🗑️ Chat history cleared',
    modelChanged: '🔄 Model updated',
    configSaved: '💾 Configuration saved',

    // Completion messages
    responseComplete: '✓ Response complete',
    swarmComplete: '🐝 Swarm collaboration complete',
    analysisComplete: '✓ Analysis complete',

    // Mode-specific
    matrixComplete: '🌳 Matrix analysis synthesized',
    reflectionComplete: '🪞 Reflection cycle complete',
    debateComplete: '⚔️ Debate concluded',
    redteamComplete: '🔴 Red Team assessment complete',
    rubricComplete: '📊 Rubric scoring complete',
    socraticComplete: '🤔 Socratic analysis complete',

    // Errors
    apiError: '⚠️ API error - check your key and try again',
    networkError: '⚠️ Network error - check your connection'
}
