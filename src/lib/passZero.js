// Pass Zero: Silent Prompt Enhancer
// Rewrites user prompts into explicit XML-structured instructions

export function enhancePrompt(userInput, persona, reasoningMode) {
    const timestamp = new Date().toISOString()

    // Base structure
    let enhanced = `<request>
  <timestamp>${timestamp}</timestamp>
  <user_input>${escapeXml(userInput)}</user_input>
  <context>
    <persona>${persona}</persona>
    <reasoning_mode>${reasoningMode}</reasoning_mode>
  </context>
</request>`

    // Add mode-specific instructions
    if (reasoningMode === 'deep') {
        enhanced = `<instructions>
  <mode>chain_of_thought</mode>
  <format>
    You MUST structure your response as:
    <thinking>
    [Your step-by-step reasoning process]
    </thinking>
    <answer>
    [Your final answer]
    </answer>
  </format>
</instructions>

${enhanced}`
    }

    if (reasoningMode === 'matrix') {
        enhanced = `<instructions>
  <mode>tree_of_thought</mode>
  <format>
    You are one branch in a multi-agent analysis.
    Provide your unique perspective on this problem.
    Be specific and actionable.
    Another agent will synthesize all branches.
  </format>
</instructions>

${enhanced}`
    }

    return enhanced
}

// Synthesis prompt for MATRIX mode
export function createSynthesisPrompt(branches, originalInput) {
    return `<synthesis_task>
  <original_request>${escapeXml(originalInput)}</original_request>
  
  <branches>
    <branch_a>
${branches.a}
    </branch_a>
    <branch_b>
${branches.b}
    </branch_b>
    <branch_c>
${branches.c}
    </branch_c>
  </branches>
  
  <instructions>
    Synthesize the above three perspectives into a unified, actionable response.
    Identify common themes and unique insights from each branch.
    Resolve any contradictions.
    Provide a clear, consolidated answer.
  </instructions>
</synthesis_task>`
}

function escapeXml(str) {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;')
}
