// Advanced Reasoning Modes Configuration

export const QUALITY_RUBRIC = {
    categories: [
        { id: 'correctness', name: 'Correctness', weight: 25, description: 'Does it solve the problem accurately?' },
        { id: 'completeness', name: 'Completeness', weight: 20, description: 'Are all requirements addressed?' },
        { id: 'clarity', name: 'Clarity', weight: 15, description: 'Is it easy to understand?' },
        { id: 'efficiency', name: 'Efficiency', weight: 15, description: 'Is it performant and optimized?' },
        { id: 'security', name: 'Security', weight: 15, description: 'Is it secure and safe?' },
        { id: 'maintainability', name: 'Maintainability', weight: 10, description: 'Is it easy to modify and extend?' }
    ],
    passThreshold: 85
}

export const ADVANCED_MODES = {
    reflection: {
        id: 'reflection',
        name: 'Reflection',
        icon: '🪞',
        description: 'Self-critique and iterative improvement',
        passes: [
            { name: 'Initial Response', prompt: 'Provide your best answer to this request.' },
            { name: 'Self-Critique', prompt: `Critically analyze your previous response:\n- What assumptions did you make?\n- What could be wrong or incomplete?\n- What edge cases did you miss?\n- Rate your confidence (1-10) and explain why.` },
            { name: 'Refined Response', prompt: `Based on your self-critique, provide an improved response that addresses the weaknesses you identified.` }
        ]
    },

    debate: {
        id: 'debate',
        name: 'Debate',
        icon: '⚔️',
        description: 'Opposing viewpoints then synthesis',
        passes: [
            { name: 'Advocate', role: 'advocate', prompt: `You are the ADVOCATE. Argue strongly IN FAVOR of this approach. Present the strongest case with evidence.` },
            { name: 'Critic', role: 'critic', prompt: `You are the CRITIC. Argue strongly AGAINST the previous approach. Challenge every assumption. Find weaknesses.` },
            { name: 'Judge', role: 'judge', prompt: `You are the JUDGE. Synthesize both sides. Provide a balanced final verdict with clear recommendations.` }
        ]
    },

    redteam: {
        id: 'redteam',
        name: 'Red Team',
        icon: '🔴',
        description: 'Adversarial attack simulation',
        passes: [
            { name: 'Initial Solution', prompt: 'Provide your solution to this request.' },
            {
                name: 'Red Team Attack', role: 'attacker', prompt: `You are a RED TEAM ATTACKER. Break the previous solution.

ATTACK VECTORS:
1. INPUT ATTACKS: Malformed inputs, injection, overflow
2. LOGIC ATTACKS: Race conditions, state manipulation, bypasses
3. RESOURCE ATTACKS: DoS, memory exhaustion, infinite loops
4. AUTH ATTACKS: Privilege escalation, session hijacking
5. DATA ATTACKS: Exfiltration, corruption, unauthorized access

For each vulnerability: describe attack, provide PoC exploit, rate severity (CRITICAL/HIGH/MEDIUM/LOW), explain impact.` },
            {
                name: 'Blue Team Defense', role: 'defender', prompt: `You are the BLUE TEAM DEFENDER. For each attack identified:
1. Acknowledge if valid
2. Provide specific defensive fix
3. Add monitoring/detection
4. Output the HARDENED VERSION with all defenses.` }
        ]
    },

    rubric: {
        id: 'rubric',
        name: 'Rubric',
        icon: '📊',
        description: 'Score against rubric, auto-fix below 85%',
        passes: [
            { name: 'Initial Solution', prompt: 'Provide your solution to this request.' },
            {
                name: 'Rubric Evaluation', role: 'evaluator', prompt: `Score the previous solution (0-100 each):

RUBRIC:
1. CORRECTNESS (25%): Solves problem accurately?
2. COMPLETENESS (20%): All requirements addressed?
3. CLARITY (15%): Easy to understand?
4. EFFICIENCY (15%): Performant and optimized?
5. SECURITY (15%): Secure and safe?
6. MAINTAINABILITY (10%): Easy to modify?

Format each as: [CATEGORY]: [score]/100 - [reasoning]
Calculate WEIGHTED TOTAL. List all categories below 85%.` },
            {
                name: 'Auto-Fix Pass', role: 'fixer', prompt: `For each category scoring BELOW 85%:
1. Identify specific issues
2. Implement targeted fixes
3. Explain improvements

Provide IMPROVED SOLUTION with all fixes. Re-score to confirm all categories ≥85%.` }
        ]
    },

    socratic: {
        id: 'socratic',
        name: 'Socratic',
        icon: '🤔',
        description: 'Question-driven deep analysis',
        passes: [
            { name: 'Core Questions', prompt: `Generate 5 critical questions that must be answered to solve this problem. Explain why each matters.` },
            { name: 'Deep Analysis', prompt: `Systematically answer each question you raised. Be thorough and cite reasoning.` },
            { name: 'Synthesis', prompt: `Based on your question-driven analysis, provide a comprehensive solution addressing all critical factors.` }
        ]
    },

    iterative: {
        id: 'iterative',
        name: 'Iterative',
        icon: '🔄',
        description: 'Progressive refinement cycles',
        maxIterations: 3,
        passes: [
            { name: 'Draft', prompt: 'Create an initial draft solution. Focus on core logic.' },
            { name: 'Enhance', prompt: 'Add missing details, improve clarity, optimize performance, add error handling.' },
            { name: 'Polish', prompt: 'Final polish: production-readiness, documentation, edge cases, best practices.' }
        ]
    }
}

// Get prompt for advanced mode pass
export function getAdvancedModePrompt(modeId, passIndex, previousResponses = []) {
    const mode = ADVANCED_MODES[modeId]
    if (!mode || !mode.passes[passIndex]) return null

    const pass = mode.passes[passIndex]
    let context = ''
    if (previousResponses.length > 0) {
        context = `\n\nPREVIOUS PASSES:\n${previousResponses.map((r, i) =>
            `--- ${mode.passes[i]?.name || 'Pass ' + (i + 1)} ---\n${r}`
        ).join('\n\n')}\n\n`
    }

    return { name: pass.name, role: pass.role || 'assistant', systemPrompt: pass.prompt, context }
}

// Meta-reasoning wrapper
export function wrapWithMetaReasoning(prompt) {
    return `${prompt}

META-REASONING: Before responding, briefly consider:
1. PROBLEM TYPE: What category? (design, implementation, debugging, analysis)
2. KEY CONSTRAINTS: Non-negotiable requirements?
3. SUCCESS CRITERIA: How to measure success?
4. APPROACH: What strategy to use?

Then provide your response.`
}

// Swarm coordination prompts
// Swarm coordination prompts with structured handoff
export const SWARM_PROMPTS = {
    architect: (userRequest) => `You are first in a swarm (ARCHITECTURE role).

REQUEST: ${userRequest}

Provide:
1. High-level design & System Architecture
2. Component breakdown
3. Data flow (Mermaid)
4. Interface definitions

IMPORTANT: End your response with a "HANDOFF SUMMARY" block for the next agent:
---
HANDOFF SUMMARY:
- Core Goal: [1 sentence]
- Key Components: [List]
- Tech Stack: [List]
- Critical Constraints: [List]
---`,

    vibe_coder: (userRequest, architectResponse) => `You are second in a swarm (IMPLEMENTATION role).

REQUEST: ${userRequest}

ARCHITECT'S DESIGN:
${architectResponse}

Implement based on the design:
1. Review the HANDOFF SUMMARY above
2. Write production-ready code for the components
3. Ensure interfaces match definitions
4. Add comprehensive error handling

IMPORTANT: End your response with a "IMPLEMENTATION SUMMARY" block:
---
IMPLEMENTATION SUMMARY:
- Files Created/Modified: [List]
- External Dependencies: [List]
- Key Functions: [List]
- Potential Risks: [List]
---`,

    strategist: (userRequest, architectResponse, coderResponse) => `You are third in a swarm (SECURITY & REVIEW role).

REQUEST: ${userRequest}

ARCHITECT'S DESIGN:
${architectResponse}

IMPLEMENTATION:
${coderResponse}

Review process:
1. Analyze the HANDOFF SUMMARY and IMPLEMENTATION SUMMARY
2. Security audit (vulnerabilities, injection, auth)
3. Code quality check (performance, readability, best practices)
4. Edge case analysis

Provide specific fixes for any issues found and certify if production-ready.`
}
