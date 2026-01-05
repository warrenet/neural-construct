import { useState, useEffect, useCallback } from 'react'
import './index.css'

import { ToastProvider, useToast } from './components/Toast'
import BiosLoader from './components/BiosLoader'
import KeyVault from './components/KeyVault'
import { getStoredKey, clearVault } from './lib/secureStorage'
import PersonaChips, { PERSONAS } from './components/PersonaChips'
import ReasoningToggle from './components/ReasoningToggle'
import ModelSelector, { getDefaultModelConfig, loadModelConfig, saveModelConfig, ALL_MODELS } from './components/ModelSelector'
import ChatStream from './components/ChatStream'
import SwarmToggle from './components/SwarmToggle'
import StatusBar from './components/StatusBar'
import PassProgress from './components/PassProgress'
import HelpModal from './components/HelpModal'
import TemplateSelector from './components/TemplateSelector'
import Footer from './components/Footer'
import { applyTemplate } from './lib/templates'
import './components/Haptics.css'
import { useHaptics } from './hooks/useHaptics'
import { useNeuralState, useSession } from './hooks/useNeuralState'
import { useOnboarding, TOAST_MESSAGES } from './hooks/useOnboarding'
import { enhancePrompt, createSynthesisPrompt } from './lib/passZero'
import { streamChat, completeChat } from './lib/openrouter'
import { ADVANCED_MODES, SWARM_PROMPTS, getAdvancedModePrompt } from './lib/advancedReasoning'

function AppContent() {
  const { toast } = useToast()
  const onboarding = useOnboarding(toast)
  const { shake, flash, triggerShake, triggerFlash, triggerError, triggerSuccess } = useHaptics()

  // Boot state
  const [booting, setBooting] = useState(true)
  const [vaultLocked, setVaultLocked] = useState(true)
  const [apiKey, setApiKey] = useState(null)

  // Stable completion handler for BiosLoader
  const handleBootComplete = useCallback(() => setBooting(false), [])

  // Load stored key on mount
  useEffect(() => {
    const checkVault = async () => {
      // If we already have a key, don't continually re-load (prevents toast loops)
      if (apiKey) return

      const storedKey = await getStoredKey()
      const envKey = import.meta.env.VITE_OPENROUTER_API_KEY

      if (storedKey) {
        setApiKey(storedKey)
        setVaultLocked(false)
      } else if (envKey) {
        setApiKey(envKey)
        setVaultLocked(false)
        // Only show toast if this is the first load
        toast.success('Environment Key Loaded')
      }
    }
    checkVault()
  }, [toast, apiKey])

  // Config state
  const [selectedPersona, setSelectedPersona] = useState('vibe_coder')
  const [reasoningMode, setReasoningMode] = useState('sprint')
  const [modelConfig, setModelConfig] = useState(getDefaultModelConfig())
  const [showSettings, setShowSettings] = useState(false)
  const [swarmEnabled, setSwarmEnabled] = useState(false)
  const [showHelp, setShowHelp] = useState(false)
  const [showTemplates, setShowTemplates] = useState(false)

  // Chat state
  const { history, addMessage, clearHistory } = useNeuralState()
  const { isStreaming, startStream, endStream, setStreamError } = useSession()
  const [input, setInput] = useState('')
  const [currentStream, setCurrentStream] = useState(null)
  const [branches, setBranches] = useState(null)
  const [tokensUsed, setTokensUsed] = useState(0)
  const [currentPass, setCurrentPass] = useState(-1)
  const [passResults, setPassResults] = useState([])
  const [responseCount, setResponseCount] = useState(0) // eslint-disable-line

  // Trigger startup tips after boot
  useEffect(() => {
    if (!booting && !vaultLocked) {
      onboarding.triggerTips('startup')
      // Trigger subtle flash on boot
      triggerFlash('cyan')
    }
  }, [booting, vaultLocked, onboarding, triggerFlash])

  // Load/save model config
  useEffect(() => { loadModelConfig().then(setModelConfig) }, [])
  useEffect(() => { saveModelConfig(modelConfig) }, [modelConfig])

  const handleVaultUnlock = (key) => {
    setApiKey(key)
    setVaultLocked(false)
    toast.success(TOAST_MESSAGES.keySaved)
    triggerSuccess()
  }

  const handleLockVault = async () => {
    await clearVault()
    setApiKey(null)
    setVaultLocked(true)
    triggerShake()
    toast.info('Vault Locked (Key Erased)')
  }

  const handleClearHistory = () => {
    clearHistory()
    toast.success(TOAST_MESSAGES.historyCleared)
  }

  const handleSwarmToggle = (enabled) => {
    setSwarmEnabled(enabled)
    if (enabled) {
      onboarding.showTip('swarm')
    }
  }

  const handleModeChange = (mode) => {
    setReasoningMode(mode)
    if (ADVANCED_MODES[mode]) {
      onboarding.showTip('advanced_modes')
    }
  }

  const handleTemplateSelect = (template, config) => {
    setInput(applyTemplate(template, '')) // Pre-fill with template
    setReasoningMode(config.mode)
    if (config.persona) setSelectedPersona(config.persona)
    if (config.useSwarm !== undefined) setSwarmEnabled(config.useSwarm)

    // Auto-focus input after selecting
    setTimeout(() => document.querySelector('input[type="text"]')?.focus(), 100)

    toast.info(`Loaded: ${template.name}`)
  }

  const getModelForPersona = (personaId) => {
    if (modelConfig.useDefault) return modelConfig.defaultModel
    return modelConfig.personaModels[personaId] || modelConfig.defaultModel
  }

  const handleSubmit = async (e) => {
    e?.preventDefault()
    e?.preventDefault()
    e?.preventDefault()
    if (!input.trim()) {
      return
    }

    if (isStreaming) {
      console.warn('Attempted to send while streaming. Resetting stream state if necessary.')
      // Optional: force reset if needed, but for now just warn
      // to allow "Are you sure?" or just swallow it less aggressively
    }

    const userMessage = input.trim()
    setInput('')
    addMessage({ role: 'user', content: userMessage })

    const model = getModelForPersona(selectedPersona)
    const enhancedPrompt = enhancePrompt(userMessage, selectedPersona, reasoningMode)

    if (swarmEnabled) {
      await handleSwarmMode(userMessage, model)
    } else if (reasoningMode === 'matrix') {
      await handleMatrixMode(userMessage, enhancedPrompt, model)
    } else if (ADVANCED_MODES[reasoningMode]) {
      await handleAdvancedMode(userMessage, reasoningMode, model)
    } else {
      const persona = PERSONAS.find(p => p.id === selectedPersona)
      await handleNormalMode(enhancedPrompt, persona, model)
    }
  }

  const handleNormalMode = async (enhancedPrompt, persona, model) => {
    startStream()
    setCurrentStream({ persona: persona.name, content: '' })

    await streamChat({
      apiKey, model,
      messages: [{ role: 'system', content: persona.prompt }, { role: 'user', content: enhancedPrompt }],
      onChunk: (chunk) => {
        setCurrentStream(prev => ({ ...prev, content: prev.content + chunk }))
        setTokensUsed(prev => prev + 1)
      },
      onComplete: (fullResponse) => {
        addMessage({ role: 'assistant', content: fullResponse, persona: persona.id, model, mode: reasoningMode })
        setCurrentStream(null)
        endStream()
        handleResponseComplete()
      },
      onError: (error) => {
        addMessage({ role: 'system', content: `Error: ${error}` })
        setCurrentStream(null)
        setStreamError(error)
        setStreamError(error)
        toast.error(TOAST_MESSAGES.apiError)
        triggerError()
      }
    })
  }

  const handleSwarmMode = async (userMessage, model) => {
    startStream()
    const responses = { architect: '', vibe_coder: '', strategist: '' }

    setCurrentStream({ persona: 'The Architect', content: '', phase: 'Swarm 1/3' })
    try {
      responses.architect = await completeChat({ apiKey, model, messages: [{ role: 'user', content: SWARM_PROMPTS.architect(userMessage) }] })
      setCurrentStream(prev => ({ ...prev, content: responses.architect }))
    } catch (err) { setStreamError(err.message); toast.error(TOAST_MESSAGES.apiError); return }

    setCurrentStream({ persona: 'The Vibe Coder', content: '', phase: 'Swarm 2/3' })
    try {
      responses.vibe_coder = await completeChat({ apiKey, model, messages: [{ role: 'user', content: SWARM_PROMPTS.vibe_coder(userMessage, responses.architect) }] })
      setCurrentStream(prev => ({ ...prev, content: responses.vibe_coder }))
    } catch (err) { setStreamError(err.message); toast.error(TOAST_MESSAGES.apiError); return }

    setCurrentStream({ persona: 'Based Strategist', content: '', phase: 'Swarm 3/3' })
    try {
      responses.strategist = await completeChat({ apiKey, model, messages: [{ role: 'user', content: SWARM_PROMPTS.strategist(userMessage, responses.architect, responses.vibe_coder) }] })
    } catch (err) { setStreamError(err.message); toast.error(TOAST_MESSAGES.apiError); return }

    addMessage({
      role: 'assistant',
      content: `## 🐝 Swarm Complete\n\n### 🏛️ Architect\n${responses.architect}\n\n---\n\n### ⚡ Vibe Coder\n${responses.vibe_coder}\n\n---\n\n### 🎯 Strategist\n${responses.strategist}`,
      persona: 'swarm', model, mode: 'swarm'
    })
    setCurrentStream(null)
    endStream()
    toast.success(TOAST_MESSAGES.swarmComplete)
    handleResponseComplete()
  }

  const handleAdvancedMode = async (userMessage, modeId, model) => {
    const mode = ADVANCED_MODES[modeId]
    if (!mode) return

    startStream()
    setPassResults([])
    const results = []

    for (let i = 0; i < mode.passes.length; i++) {
      setCurrentPass(i)
      const passConfig = getAdvancedModePrompt(modeId, i, results)
      setCurrentStream({ persona: passConfig.name, content: '', phase: `Pass ${i + 1}/${mode.passes.length}` })

      try {
        const result = await completeChat({
          apiKey, model,
          messages: [{ role: 'system', content: passConfig.systemPrompt }, { role: 'user', content: userMessage + passConfig.context }]
        })
        results.push(result)
        setPassResults([...results])
        setCurrentStream(prev => ({ ...prev, content: result }))
      } catch (err) { setStreamError(err.message); toast.error(TOAST_MESSAGES.apiError); return }
    }

    const formattedResponse = results.map((r, i) => `### ${mode.passes[i].name}\n${r}`).join('\n\n---\n\n')
    addMessage({ role: 'assistant', content: `## ${mode.icon} ${mode.name} Complete\n\n${formattedResponse}`, persona: modeId, model, mode: modeId })
    setCurrentStream(null)
    setCurrentPass(-1)
    endStream()
    toast.success(TOAST_MESSAGES[`${modeId}Complete`] || TOAST_MESSAGES.analysisComplete)
    handleResponseComplete()
  }

  const handleMatrixMode = async (originalInput, enhancedPrompt, model) => {
    startStream()
    setBranches({ a: { content: '', complete: false }, b: { content: '', complete: false }, c: { content: '', complete: false } })

    const branchPrompts = [
      { id: 'a', perspective: 'Focus on ARCHITECTURE. What systems and patterns?' },
      { id: 'b', perspective: 'Focus on IMPLEMENTATION. What code and techniques?' },
      { id: 'c', perspective: 'Focus on RISKS. What could fail? Security issues?' }
    ]

    try {
      const branchResults = await Promise.all(
        branchPrompts.map(async (branch) => {
          try {
            const result = await completeChat({ apiKey, model, messages: [{ role: 'system', content: branch.perspective }, { role: 'user', content: enhancedPrompt }] })
            setBranches(prev => ({ ...prev, [branch.id]: { content: result, complete: true } }))
            return { id: branch.id, content: result }
          } catch (err) {
            setBranches(prev => ({ ...prev, [branch.id]: { error: err.message, complete: true } }))
            return { id: branch.id, content: `Error: ${err.message}`, error: true }
          }
        })
      )

      const branchContents = { a: branchResults[0]?.content, b: branchResults[1]?.content, c: branchResults[2]?.content }
      setBranches(prev => ({ ...prev, synthesis: { content: '', streaming: true } }))

      await streamChat({
        apiKey, model,
        messages: [{ role: 'system', content: 'Synthesize these perspectives.' }, { role: 'user', content: createSynthesisPrompt(branchContents, originalInput) }],
        onChunk: (chunk) => setBranches(prev => ({ ...prev, synthesis: { content: (prev.synthesis?.content || '') + chunk, streaming: true } })),
        onComplete: (fullResponse) => {
          setBranches(prev => ({ ...prev, synthesis: { content: fullResponse, complete: true } }))
          addMessage({ role: 'assistant', content: `## 🌳 Matrix\n\n### A: Architecture\n${branchContents.a}\n\n### B: Implementation\n${branchContents.b}\n\n### C: Risks\n${branchContents.c}\n\n---\n\n## 🔮 Synthesis\n${fullResponse}`, persona: 'matrix', model, mode: 'matrix' })
          endStream()
          toast.success(TOAST_MESSAGES.matrixComplete)
          handleResponseComplete()
        },
        onError: (error) => { setStreamError(error); toast.error(TOAST_MESSAGES.apiError) }
      })
    } catch (err) { setStreamError(err.message); toast.error(TOAST_MESSAGES.apiError) }
  }

  const handleResponseComplete = () => {
    setResponseCount(prev => {
      const newCount = prev + 1
      if (newCount === 1) onboarding.showTip('first_response')
      if (newCount % 5 === 0) onboarding.maybeShowContextualTip()
      return newCount
    })
  }

  if (booting) return <BiosLoader onComplete={handleBootComplete} />
  if (vaultLocked) return <><div className="crt-overlay" /><KeyVault onUnlock={handleVaultUnlock} /></>

  const advancedMode = ADVANCED_MODES[reasoningMode]

  return (
    <>
      <div className={`crt-overlay ${shake ? 'shake-screen' : ''}`} />
      <div className={`flash-overlay ${flash ? 'flash-active flash-' + flash : ''}`} />

      <HelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} />
      {showTemplates && <TemplateSelector onSelect={handleTemplateSelect} onClose={() => setShowTemplates(false)} />}

      <div className="min-h-screen flex flex-col">
        <StatusBar isConnected={!!apiKey} currentModel={getModelForPersona(selectedPersona)} currentMode={reasoningMode} tokensUsed={tokensUsed} isStreaming={isStreaming} />

        <header className="border-b border-gray-800 p-4">
          <div className="flex items-center justify-between max-w-6xl mx-auto">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🧠</span>
              <h1 className="text-lg font-bold text-cyan-400 glow-cyan tracking-wider">THE NEURAL CONSTRUCT</h1>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setShowHelp(true)} className="btn-secondary text-sm" data-tooltip="Help & Guide">❓</button>
              <button onClick={() => setShowTemplates(true)} className="btn-secondary text-sm" data-tooltip="Templates">📋</button>
              <button onClick={() => setShowSettings(!showSettings)} className="btn-secondary text-sm lg:hidden" data-tooltip="Settings">⚙️</button>
              <button onClick={handleLockVault} className="text-sm text-gray-500 hover:text-red-400 transition-colors" data-tooltip="Sign Out & Lock">🔒</button>
            </div>
          </div>
        </header>

        <div className="flex-1 flex max-w-6xl mx-auto w-full">
          <aside className={`w-80 border-r border-gray-800 p-4 space-y-5 overflow-y-auto ${showSettings ? 'block' : 'hidden lg:block'}`}>
            <PersonaChips selected={selectedPersona} onSelect={setSelectedPersona} disabled={isStreaming || swarmEnabled} />
            <ReasoningToggle selected={reasoningMode} onSelect={handleModeChange} disabled={isStreaming} />
            <SwarmToggle enabled={swarmEnabled} onToggle={handleSwarmToggle} disabled={isStreaming} />
            <ModelSelector config={modelConfig} onChange={setModelConfig} disabled={isStreaming} />
            {advancedMode && currentPass >= 0 && <PassProgress passes={advancedMode.passes} currentPass={currentPass} passResults={passResults} />}
            <div className="pt-4 border-t border-gray-800">
              <button onClick={handleClearHistory} disabled={isStreaming || history.length === 0} className="btn-secondary w-full text-sm">🗑️ Clear History</button>
            </div>
          </aside>

          <main className="flex-1 flex flex-col">
            <ChatStream messages={history} isStreaming={isStreaming} currentStream={currentStream} branches={branches} />
            <form onSubmit={handleSubmit} className="border-t border-gray-800 p-4">
              <div className="flex gap-3">
                <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Enter your directive..." disabled={isStreaming} className="flex-1" autoFocus />
                <button type="submit" disabled={!input.trim()} className="btn-primary px-6">{isStreaming ? '...' : '▶ SEND'}</button>
              </div>
              <div className="text-xs text-gray-600 mt-2 text-center">
                {swarmEnabled ? '🐝 Swarm' : PERSONAS.find(p => p.id === selectedPersona)?.name} • {reasoningMode.toUpperCase()} • <kbd className="kbd">Enter</kbd> to send
              </div>
            </form>
          </main>
        </div>
        <Footer />
      </div>
    </>
  )
}

export default function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  )
}
