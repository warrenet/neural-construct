/**
 * FirstRunWizard - Interactive onboarding for new users
 * Shows a 4-step walkthrough of the app's main features
 */
import { useState, useEffect } from 'react'
import { get, set } from 'idb-keyval'

const WIZARD_KEY = 'neural-construct-wizard-complete'

const STEPS = [
    {
        id: 'welcome',
        icon: '🧠',
        title: 'Welcome to The Neural Construct',
        subtitle: 'Your Tactical AI Command Center',
        content: 'An advanced interface for AI-powered reasoning, code generation, and problem solving. Let\'s take a quick tour of the key features.',
        visual: '🚀'
    },
    {
        id: 'council',
        icon: '👥',
        title: 'Meet The Council',
        subtitle: '3 Specialized AI Agents',
        content: 'Each agent has a unique cognitive style. The Architect designs systems, The Vibe Coder writes production code, and The Strategist handles security review.',
        features: [
            { icon: '🏛️', name: 'Architect', desc: 'Systems & Design' },
            { icon: '⚡', name: 'Vibe Coder', desc: 'Implementation' },
            { icon: '🎯', name: 'Strategist', desc: 'Security & Review' }
        ]
    },
    {
        id: 'modes',
        icon: '🔀',
        title: 'Reasoning Modes',
        subtitle: 'Different approaches for different problems',
        content: 'Choose how deeply the AI should think. SPRINT is fast, DEEP shows reasoning, and MATRIX runs 3 parallel analyses.',
        features: [
            { icon: '⚡', name: 'SPRINT', desc: 'Fast & direct' },
            { icon: '🔗', name: 'DEEP', desc: 'Shows thinking' },
            { icon: '🌳', name: 'MATRIX', desc: '3 parallel agents' }
        ]
    },
    {
        id: 'ready',
        icon: '✨',
        title: 'You\'re Ready!',
        subtitle: 'Start building amazing things',
        content: 'Click the 💡 button anytime for tips, or ❓ for the full guide. Your API key is encrypted locally and never sent to our servers.',
        visual: '🎯'
    }
]

export default function FirstRunWizard({ onComplete }) {
    const [currentStep, setCurrentStep] = useState(0)
    const [isVisible, setIsVisible] = useState(false)
    const [isExiting, setIsExiting] = useState(false)

    // Check if wizard should be shown
    useEffect(() => {
        const checkWizard = async () => {
            const complete = await get(WIZARD_KEY)
            if (!complete) {
                setIsVisible(true)
            }
        }
        checkWizard()
    }, [])

    const handleNext = () => {
        if (currentStep < STEPS.length - 1) {
            setCurrentStep(prev => prev + 1)
        } else {
            handleComplete()
        }
    }

    const handleSkip = () => {
        handleComplete()
    }

    const handleComplete = async () => {
        setIsExiting(true)
        await set(WIZARD_KEY, true)
        setTimeout(() => {
            setIsVisible(false)
            onComplete?.()
        }, 300)
    }

    if (!isVisible) return null

    const step = STEPS[currentStep]
    const isLastStep = currentStep === STEPS.length - 1

    return (
        <div className={`fixed inset-0 z-[60] flex items-center justify-center p-4 transition-opacity duration-300 ${isExiting ? 'opacity-0' : 'opacity-100'}`}>
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/90 backdrop-blur-md" />

            {/* Modal */}
            <div className="relative w-full max-w-lg animate-slide-up">
                <div className="panel p-8 border-cyan-400/30 shadow-2xl shadow-cyan-400/10">
                    {/* Progress Dots */}
                    <div className="flex justify-center gap-2 mb-6">
                        {STEPS.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentStep(index)}
                                className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentStep
                                    ? 'w-6 bg-cyan-400'
                                    : index < currentStep
                                        ? 'bg-cyan-400/50'
                                        : 'bg-gray-700'
                                    }`}
                            />
                        ))}
                    </div>

                    {/* Icon */}
                    <div className="text-center mb-4">
                        <span className="text-5xl">{step.icon}</span>
                    </div>

                    {/* Title */}
                    <h2 className="text-2xl font-bold text-center text-white mb-1">
                        {step.title}
                    </h2>
                    <p className="text-center text-cyan-400 text-sm mb-4">
                        {step.subtitle}
                    </p>

                    {/* Content */}
                    <p className="text-center text-gray-400 mb-6 leading-relaxed">
                        {step.content}
                    </p>

                    {/* Features Grid (if present) */}
                    {step.features && (
                        <div className="grid grid-cols-3 gap-3 mb-6">
                            {step.features.map((feature, i) => (
                                <div key={i} className="panel p-3 text-center hover:border-cyan-400/30 transition-colors">
                                    <div className="text-2xl mb-1">{feature.icon}</div>
                                    <div className="text-sm font-medium text-gray-200">{feature.name}</div>
                                    <div className="text-xs text-gray-500">{feature.desc}</div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Visual (if present) */}
                    {step.visual && (
                        <div className="text-center text-6xl mb-6 animate-pulse">
                            {step.visual}
                        </div>
                    )}

                    {/* Buttons */}
                    <div className="flex gap-3">
                        {!isLastStep && (
                            <button
                                onClick={handleSkip}
                                className="flex-1 py-3 text-gray-500 hover:text-gray-300 transition-colors text-sm"
                            >
                                Skip Tour
                            </button>
                        )}
                        <button
                            onClick={handleNext}
                            className="flex-1 btn-primary py-3"
                        >
                            {isLastStep ? 'Let\'s Go!' : 'Next'}
                        </button>
                    </div>

                    {/* Step Counter */}
                    <div className="text-center mt-4 text-xs text-gray-600">
                        Step {currentStep + 1} of {STEPS.length}
                    </div>
                </div>
            </div>
        </div>
    )
}

// To reset wizard for testing, run in console:
// import('idb-keyval').then(m => m.set('neural-construct-wizard-complete', false))
