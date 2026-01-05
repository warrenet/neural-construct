// Mega Template Library - Comprehensive prompt templates with advanced reasoning

// Template categories
export const TEMPLATE_CATEGORIES = [
    { id: 'mega', name: '🔥 Mega Templates', description: 'Multi-phase extreme reasoning workflows' },
    { id: 'code', name: '💻 Code & Architecture', description: 'Development and system design' },
    { id: 'analysis', name: '🔍 Analysis & Research', description: 'Deep investigation and study' },
    { id: 'creative', name: '✨ Creative & Content', description: 'Writing and ideation' },
    { id: 'business', name: '📊 Business & Strategy', description: 'Planning and decision making' },
    { id: 'security', name: '🔒 Security & Audit', description: 'Vulnerability assessment and hardening' },
    { id: 'learning', name: '📚 Learning & Teaching', description: 'Education and skill building' }
]

// ============================================================
// MEGA TEMPLATES - Extreme multi-phase reasoning workflows
// ============================================================

export const MEGA_TEMPLATES = [
    {
        id: 'mega_system_architect',
        name: '🏗️ System Architect Supreme',
        category: 'mega',
        description: 'Complete system design from requirements to deployment strategy',
        recommendedMode: 'matrix',
        recommendedPersona: 'architect',
        useSwarm: true,
        phases: ['Requirements Analysis', 'Architecture Design', 'Implementation Plan', 'Risk Assessment', 'Deployment Strategy'],
        prompt: `You are executing the SYSTEM ARCHITECT SUPREME protocol.

PHASE 1 - REQUIREMENTS DEEP DIVE:
• Extract all explicit and implicit requirements
• Identify stakeholders and their needs
• Define success criteria and KPIs
• List technical and business constraints

PHASE 2 - ARCHITECTURE SYNTHESIS:
• Design high-level system architecture
• Define component boundaries and responsibilities
• Create data flow diagrams (Mermaid)
• Specify API contracts and interfaces

PHASE 3 - IMPLEMENTATION ROADMAP:
• Break down into implementable modules
• Define development phases and milestones
• Identify technology stack recommendations
• Estimate effort and timeline

PHASE 4 - RISK MATRIX:
• Security vulnerability assessment
• Scalability bottleneck analysis
• Dependency risk evaluation
• Mitigation strategies for each risk

PHASE 5 - DEPLOYMENT BLUEPRINT:
• Infrastructure requirements
• CI/CD pipeline design
• Monitoring and observability plan
• Rollback and disaster recovery procedures

USER REQUEST:
{{INPUT}}

Execute all 5 phases with thorough analysis. Use Mermaid diagrams where applicable.`
    },
    {
        id: 'mega_code_forge',
        name: '⚡ Code Forge Ultimate',
        category: 'mega',
        description: 'Enterprise-grade code generation with full review cycle',
        recommendedMode: 'rubric',
        recommendedPersona: 'vibe_coder',
        useSwarm: true,
        phases: ['Specification', 'Implementation', 'Testing', 'Security Review', 'Documentation'],
        prompt: `You are executing the CODE FORGE ULTIMATE protocol.

FORGE PHASE 1 - SPECIFICATION:
• Parse requirements into technical specifications
• Define function signatures and type contracts
• Identify edge cases and error conditions
• List all dependencies needed

FORGE PHASE 2 - IMPLEMENTATION:
• Write production-grade code
• Apply SOLID principles
• Implement comprehensive error handling
• Add strategic inline documentation

FORGE PHASE 3 - TESTING SUITE:
• Unit tests for all functions
• Integration test scenarios
• Edge case coverage
• Mock data generators

FORGE PHASE 4 - SECURITY HARDENING:
• Input validation and sanitization
• Authentication/authorization checks
• SQL injection / XSS prevention
• Secrets management

FORGE PHASE 5 - DOCUMENTATION:
• API documentation with examples
• README with setup instructions
• Architecture decision records
• Changelog entry

USER REQUEST:
{{INPUT}}

Deliver complete, production-ready code with all supporting artifacts.`
    },
    {
        id: 'mega_problem_solver',
        name: '🧠 Cognitive Problem Solver',
        category: 'mega',
        description: 'Multi-dimensional problem analysis using advanced reasoning',
        recommendedMode: 'socratic',
        useSwarm: false,
        phases: ['Problem Definition', 'Root Cause Analysis', 'Solution Generation', 'Evaluation', 'Implementation Path'],
        prompt: `You are executing the COGNITIVE PROBLEM SOLVER protocol.

COGNITION LAYER 1 - PROBLEM CRYSTALLIZATION:
• Restate the problem in precise terms
• Identify what we know vs. what we assume
• Define the desired end state
• Quantify the gap between current and desired state

COGNITION LAYER 2 - ROOT CAUSE EXCAVATION:
• Apply 5 Whys analysis
• Create fishbone diagram (Mermaid)
• Identify systemic vs. symptomatic issues
• Map cause-effect relationships

COGNITION LAYER 3 - SOLUTION SYNTHESIS:
• Generate 5+ potential solutions
• Think laterally - what would [expert] do?
• Consider unconventional approaches
• Identify quick wins vs. long-term fixes

COGNITION LAYER 4 - EVALUATION MATRIX:
• Score each solution on: Feasibility, Impact, Effort, Risk
• Identify trade-offs and dependencies
• Recommend top 2 solutions with rationale
• Define success metrics

COGNITION LAYER 5 - ACTION BLUEPRINT:
• Step-by-step implementation plan
• Resource requirements
• Timeline with milestones
• Contingency plans

PROBLEM TO SOLVE:
{{INPUT}}

Apply rigorous cognitive analysis. Show your reasoning at each layer.`
    },
    {
        id: 'mega_research_deep',
        name: '🔬 Deep Research Protocol',
        category: 'mega',
        description: 'Comprehensive research with source synthesis and conclusions',
        recommendedMode: 'debate',
        useSwarm: false,
        phases: ['Scope Definition', 'Information Gathering', 'Critical Analysis', 'Synthesis', 'Conclusions'],
        prompt: `You are executing the DEEP RESEARCH PROTOCOL.

RESEARCH PHASE 1 - SCOPE DEFINITION:
• Define research questions
• Identify key concepts and terminology
• Set boundaries and exclusions
• Define information quality criteria

RESEARCH PHASE 2 - INFORMATION MAPPING:
• Survey the knowledge landscape
• Identify key frameworks and models
• Note conflicting viewpoints
• Highlight knowledge gaps

RESEARCH PHASE 3 - CRITICAL ANALYSIS:
• Evaluate source credibility
• Identify biases and limitations
• Compare competing theories
• Assess evidence quality

RESEARCH PHASE 4 - SYNTHESIS:
• Integrate findings into coherent narrative
• Identify patterns and themes
• Resolve contradictions
• Build conceptual framework

RESEARCH PHASE 5 - CONCLUSIONS:
• State key findings
• Acknowledge limitations
• Suggest areas for further research
• Provide actionable recommendations

RESEARCH TOPIC:
{{INPUT}}

Conduct thorough research. Cite concepts and frameworks used.`
    },
    {
        id: 'mega_startup_forge',
        name: '🚀 Startup Forge Complete',
        category: 'mega',
        description: 'Full startup ideation to MVP planning',
        recommendedMode: 'matrix',
        useSwarm: true,
        phases: ['Ideation', 'Validation', 'Business Model', 'MVP Spec', 'Go-to-Market'],
        prompt: `You are executing the STARTUP FORGE protocol.

FORGE STAGE 1 - IDEATION EXPLOSION:
• Problem space exploration
• Target user persona definition
• Value proposition canvas
• Competitive landscape analysis

FORGE STAGE 2 - VALIDATION FRAMEWORK:
• Hypothesis definition
• Experiment design
• Success/failure criteria
• Risk assessment

FORGE STAGE 3 - BUSINESS MODEL:
• Revenue model options
• Cost structure analysis
• Unit economics projection
• Business model canvas

FORGE STAGE 4 - MVP SPECIFICATION:
• Core feature set (ruthlessly prioritized)
• Technical architecture
• Development timeline
• Resource requirements

FORGE STAGE 5 - GO-TO-MARKET:
• Launch strategy
• Marketing channels
• Growth metrics
• First 90 days playbook

STARTUP IDEA:
{{INPUT}}

Execute complete startup planning. Be specific and actionable.`
    }
]

// ============================================================
// MULTI-PASS TEMPLATES - Requires advanced reasoning modes
// ============================================================

export const MULTIPASS_TEMPLATES = [
    {
        id: 'mp_code_review',
        name: '🔍 Elite Code Review',
        category: 'code',
        recommendedMode: 'redteam',
        description: 'Red team attack + Blue team hardening',
        prompt: `Perform an ELITE CODE REVIEW on the following code.

ATTACK PHASE: Find every vulnerability, anti-pattern, and weakness.
DEFENSE PHASE: Provide hardened version with all issues fixed.

CODE TO REVIEW:
{{INPUT}}`
    },
    {
        id: 'mp_refactor',
        name: '🔧 Refactor & Elevate',
        category: 'code',
        recommendedMode: 'rubric',
        description: 'Score, critique, and refactor to excellence',
        prompt: `REFACTOR & ELEVATE this code to production excellence.

Score on: Correctness, Clarity, Performance, Security, Maintainability
Fix anything below 85%. Deliver the elevated version.

CODE TO REFACTOR:
{{INPUT}}`
    },
    {
        id: 'mp_decision',
        name: '⚖️ Decision Forge',
        category: 'business',
        recommendedMode: 'debate',
        description: 'Advocate vs Critic analysis for tough decisions',
        prompt: `DECISION FORGE: Analyze this decision thoroughly.

ADVOCATE: Argue FOR this decision with strongest evidence.
CRITIC: Argue AGAINST with strongest counterpoints.
JUDGE: Synthesize into balanced recommendation.

DECISION TO ANALYZE:
{{INPUT}}`
    },
    {
        id: 'mp_explain',
        name: '🎓 Deep Explainer',
        category: 'learning',
        recommendedMode: 'socratic',
        description: 'Question-driven deep understanding',
        prompt: `DEEP EXPLAINER: Teach this concept thoroughly.

1. What are the 5 essential questions to understand this?
2. Answer each question comprehensively
3. Synthesize into a clear mental model

TOPIC TO EXPLAIN:
{{INPUT}}`
    },
    {
        id: 'mp_essay',
        name: '✍️ Essay Forge',
        category: 'creative',
        recommendedMode: 'reflection',
        description: 'Write, critique, and polish to excellence',
        prompt: `ESSAY FORGE: Create an excellent piece.

DRAFT: Write the initial version
CRITIQUE: Identify weaknesses in argument, style, clarity
POLISH: Deliver the refined final version

ESSAY TOPIC:
{{INPUT}}`
    },
    {
        id: 'mp_security_audit',
        name: '🛡️ Security Deep Audit',
        category: 'security',
        recommendedMode: 'redteam',
        description: 'Full penetration test simulation',
        prompt: `SECURITY DEEP AUDIT: Comprehensive vulnerability assessment.

RED TEAM: Attempt to breach this system. Document attack vectors.
BLUE TEAM: Defend against each attack. Implement countermeasures.

TARGET SYSTEM:
{{INPUT}}`
    }
]

// ============================================================
// SINGLE-PASS TEMPLATES - Quick, focused prompts
// ============================================================

export const SINGLEPASS_TEMPLATES = [
    // Code templates
    {
        id: 'sp_function',
        name: '⚡ Quick Function',
        category: 'code',
        recommendedMode: 'sprint',
        recommendedPersona: 'vibe_coder',
        prompt: `Write a clean, production-ready function for: {{INPUT}}

Include: type hints, error handling, docstring, and usage example.`
    },
    {
        id: 'sp_debug',
        name: '🐛 Debug Helper',
        category: 'code',
        recommendedMode: 'deep',
        recommendedPersona: 'strategist',
        prompt: `Debug this code. Show your thinking process.

What's wrong? Why? How to fix? Provide corrected code.

CODE:
{{INPUT}}`
    },
    {
        id: 'sp_api_design',
        name: '🔌 API Designer',
        category: 'code',
        recommendedMode: 'sprint',
        recommendedPersona: 'architect',
        prompt: `Design a RESTful API for: {{INPUT}}

Include: endpoints, methods, request/response schemas (JSON), and example calls.`
    },
    {
        id: 'sp_sql',
        name: '📊 SQL Query Builder',
        category: 'code',
        recommendedMode: 'sprint',
        recommendedPersona: 'vibe_coder',
        prompt: `Write optimized SQL for: {{INPUT}}

Include: the query, explanation of logic, and performance considerations.`
    },
    {
        id: 'sp_regex',
        name: '🔣 Regex Wizard',
        category: 'code',
        recommendedMode: 'sprint',
        prompt: `Create a regex pattern for: {{INPUT}}

Include: the pattern, explanation of each part, and test cases.`
    },
    // Analysis templates
    {
        id: 'sp_pros_cons',
        name: '📋 Pros & Cons',
        category: 'analysis',
        recommendedMode: 'sprint',
        prompt: `Analyze pros and cons of: {{INPUT}}

Be balanced. Consider short-term and long-term impacts.`
    },
    {
        id: 'sp_compare',
        name: '⚖️ Quick Compare',
        category: 'analysis',
        recommendedMode: 'sprint',
        prompt: `Compare these options: {{INPUT}}

Create a comparison table with key criteria. Recommend the best choice.`
    },
    {
        id: 'sp_summarize',
        name: '📝 Smart Summary',
        category: 'analysis',
        recommendedMode: 'sprint',
        prompt: `Summarize this content in 3 levels:
1. One sentence
2. One paragraph
3. Detailed bullet points

CONTENT:
{{INPUT}}`
    },
    // Creative templates
    {
        id: 'sp_brainstorm',
        name: '💡 Rapid Brainstorm',
        category: 'creative',
        recommendedMode: 'sprint',
        prompt: `Brainstorm 10 creative ideas for: {{INPUT}}

Be diverse. Include safe choices AND wild ideas.`
    },
    {
        id: 'sp_rewrite',
        name: '✨ Tone Rewriter',
        category: 'creative',
        recommendedMode: 'sprint',
        prompt: `Rewrite this in 3 different tones:
1. Professional/Formal
2. Casual/Friendly
3. Persuasive/Marketing

ORIGINAL:
{{INPUT}}`
    },
    // Business templates
    {
        id: 'sp_email',
        name: '📧 Email Crafter',
        category: 'business',
        recommendedMode: 'sprint',
        prompt: `Write a professional email for this situation: {{INPUT}}

Include: subject line, body, and call to action.`
    },
    {
        id: 'sp_meeting',
        name: '📅 Meeting Prep',
        category: 'business',
        recommendedMode: 'sprint',
        prompt: `Prepare for this meeting: {{INPUT}}

Include: agenda, key points to cover, questions to ask, and desired outcomes.`
    }
]

// ============================================================
// SWARM-OPTIMIZED TEMPLATES - Best with Swarm mode
// ============================================================

export const SWARM_TEMPLATES = [
    {
        id: 'swarm_fullstack',
        name: '🐝 Full-Stack Feature',
        category: 'code',
        useSwarm: true,
        description: 'Architect designs, Coder implements, Strategist reviews',
        prompt: `Build a complete full-stack feature for: {{INPUT}}

ARCHITECT: Design the system architecture and data models
VIBE CODER: Implement frontend + backend code
STRATEGIST: Review for security and best practices`
    },
    {
        id: 'swarm_product',
        name: '🐝 Product Feature Spec',
        category: 'business',
        useSwarm: true,
        description: 'Complete feature specification workflow',
        prompt: `Create a complete product specification for: {{INPUT}}

ARCHITECT: Technical architecture and integration points
VIBE CODER: Implementation approach and estimates
STRATEGIST: Risk assessment and edge cases`
    },
    {
        id: 'swarm_debug_complex',
        name: '🐝 Complex Bug Hunt',
        category: 'code',
        useSwarm: true,
        description: 'Multi-perspective debugging',
        prompt: `Debug this complex issue: {{INPUT}}

ARCHITECT: Analyze system-level causes
VIBE CODER: Trace code-level issues and fix
STRATEGIST: Identify root cause and prevention`
    }
]

// ============================================================
// CASUAL TEMPLATES - Friendly, easy-to-use quick helpers
// ============================================================

export const CASUAL_TEMPLATES = [
    {
        id: 'casual_eli5',
        name: '👶 Explain Like I\'m 5',
        category: 'learning',
        recommendedMode: 'sprint',
        costTier: 'free',
        prompt: `Explain this to me like I'm 5 years old. Use simple words, fun examples, and maybe an analogy with toys or food!

TOPIC: {{INPUT}}`
    },
    {
        id: 'casual_tldr',
        name: '⏱️ TL;DR This',
        category: 'analysis',
        recommendedMode: 'sprint',
        costTier: 'free',
        prompt: `Give me the TL;DR (Too Long; Didn't Read) version of this. Just the key points, real quick!

{{INPUT}}`
    },
    {
        id: 'casual_roast',
        name: '🔥 Roast My Code',
        category: 'code',
        recommendedMode: 'sprint',
        recommendedPersona: 'strategist',
        costTier: 'free',
        prompt: `Roast this code! Be funny but also actually helpful. Point out what's wrong in a humorous way, then give me the fix.

CODE:
{{INPUT}}`
    },
    {
        id: 'casual_vibe_check',
        name: '✨ Vibe Check',
        category: 'creative',
        recommendedMode: 'sprint',
        costTier: 'free',
        prompt: `Give this a vibe check! What's the overall feeling? Is it hitting or missing? Give me honest feedback in a chill way.

{{INPUT}}`
    },
    {
        id: 'casual_fix_quick',
        name: '🩹 Quick Fix',
        category: 'code',
        recommendedMode: 'sprint',
        costTier: 'free',
        prompt: `Just fix this real quick. No explanation needed, just give me the corrected version:

{{INPUT}}`
    },
    {
        id: 'casual_name_it',
        name: '🏷️ Name That Thing',
        category: 'creative',
        recommendedMode: 'sprint',
        costTier: 'free',
        prompt: `Help me name this! Give me 10 name options - some professional, some creative, some fun. For:

{{INPUT}}`
    },
    {
        id: 'casual_make_pretty',
        name: '💅 Make It Pretty',
        category: 'code',
        recommendedMode: 'sprint',
        costTier: 'free',
        prompt: `Make this code prettier! Better formatting, cleaner structure, nicer variable names. Keep the logic the same.

{{INPUT}}`
    },
    {
        id: 'casual_what_if',
        name: '🤔 What If...',
        category: 'creative',
        recommendedMode: 'sprint',
        costTier: 'free',
        prompt: `Let's explore "what if" scenarios for this situation. Give me 5 interesting possibilities:

{{INPUT}}`
    }
]

// ============================================================
// ULTRA-COGNITIVE TEMPLATES - Maximum reasoning depth
// ============================================================

export const ULTRA_COGNITIVE_TEMPLATES = [
    {
        id: 'ultra_metacognition',
        name: '🧠 Meta-Cognitive Deep Dive',
        category: 'mega',
        recommendedMode: 'reflection',
        costTier: 'premium',
        description: 'Think about thinking - analyze the reasoning process itself',
        prompt: `ENGAGE META-COGNITIVE PROTOCOL: Think about thinking.

LAYER 1 - INITIAL ANALYSIS:
Analyze the problem/question at face value. What's being asked?

LAYER 2 - ASSUMPTION AUDIT:
What assumptions am I making? Which are valid? Which might be wrong?

LAYER 3 - COGNITIVE BIAS CHECK:
Am I falling into any cognitive traps?
• Confirmation bias?
• Anchoring?
• Availability heuristic?
• Dunning-Kruger?

LAYER 4 - ALTERNATIVE FRAMES:
How would I see this differently if I were:
• A complete beginner?
• A world expert?
• From a different culture/background?
• Living 50 years in the future?

LAYER 5 - EPISTEMIC HUMILITY:
• What do I NOT know that I should?
• What COULD I be wrong about?
• What's the confidence level of my answer?

LAYER 6 - SYNTHESIS:
Now, with full meta-awareness, provide my best answer.

SUBJECT FOR META-ANALYSIS:
{{INPUT}}`
    },
    {
        id: 'ultra_first_principles',
        name: '🔬 First Principles Deconstruction',
        category: 'mega',
        recommendedMode: 'socratic',
        costTier: 'premium',
        description: 'Break down to fundamental truths and rebuild',
        prompt: `FIRST PRINCIPLES DECONSTRUCTION PROTOCOL:

PHASE 1 - STRIP TO FUNDAMENTALS:
Remove all assumptions. What are the absolute base truths here?
For each "fact" ask: "Is this truly fundamental, or derived from something else?"

PHASE 2 - QUESTION EVERYTHING:
• Why does this work this way?
• Says who? Based on what evidence?
• What if the opposite were true?
• What's the first domino in this chain?

PHASE 3 - IDENTIFY AXIOMS:
What are the unprovable but necessary starting assumptions?
List them explicitly.

PHASE 4 - REBUILD FROM SCRATCH:
If you were inventing this from zero, knowing only the fundamentals, what would you build?

PHASE 5 - COMPARE:
How does your first-principles solution differ from the conventional approach?
What insights emerge from the difference?

SUBJECT FOR DECONSTRUCTION:
{{INPUT}}`
    },
    {
        id: 'ultra_systems_think',
        name: '🌐 Systems Thinking Analysis',
        category: 'mega',
        recommendedMode: 'matrix',
        costTier: 'premium',
        description: 'Analyze as a complex adaptive system',
        prompt: `SYSTEMS THINKING ANALYSIS PROTOCOL:

SYSTEM MAP:
• Identify all actors/components in the system
• Map relationships and dependencies
• Identify feedback loops (reinforcing and balancing)
• Find leverage points

DYNAMICS ANALYSIS:
• What are the stocks (accumulations)?
• What are the flows (rates of change)?
• Where are the delays?
• What creates inertia/resistance to change?

EMERGENT PROPERTIES:
• What behaviors emerge from component interactions?
• What's unpredictable from parts alone?
• Where does the whole exceed sum of parts?

INTERVENTION DESIGN:
• Where are the high-leverage intervention points?
• What are likely unintended consequences?
• What feedback loops might amplify or dampen changes?
• What's the minimum viable intervention?

Create a Mermaid diagram showing the system dynamics.

SYSTEM TO ANALYZE:
{{INPUT}}`
    },
    {
        id: 'ultra_steelman',
        name: '💪 Steel Man + Weak Man',
        category: 'analysis',
        recommendedMode: 'debate',
        costTier: 'premium',
        description: 'Strongest AND weakest versions of an argument',
        prompt: `STEEL MAN + WEAK MAN PROTOCOL:

PHASE 1 - STEEL MAN (Strongest Version):
Present the STRONGEST POSSIBLE version of this position.
• Assume maximum good faith
• Fill in any gaps with the best possible interpretation
• Add supporting evidence the author might have missed
• Make it as compelling as possible

PHASE 2 - WEAK MAN (Weakest Version):
Present the WEAKEST defensible version.
• Identify logical gaps
• Find hidden assumptions
• Locate the crux - where does it most rely on unproven claims?

PHASE 3 - TRUTH TRIANGULATION:
• Where does the steel man genuinely succeed?
• Where does even the steel man fail?
• What's the "true" position between extremes?

PHASE 4 - SYNTHESIS:
Provide a nuanced, mature position that acknowledges complexity.

POSITION TO ANALYZE:
{{INPUT}}`
    },
    {
        id: 'ultra_inversion',
        name: '🔄 Inversion Thinking',
        category: 'analysis',
        recommendedMode: 'reflection',
        costTier: 'premium',
        description: 'Solve by considering the opposite',
        prompt: `INVERSION THINKING PROTOCOL: Solve backwards.

THE QUESTION: {{INPUT}}

STEP 1 - INVERT THE GOAL:
Instead of "How do I succeed?" ask "How would I guarantee failure?"
List all the ways to definitely fail at this.

STEP 2 - ANTI-PATTERNS:
What do people commonly do that leads to failure here?
What mistakes are most tempting?

STEP 3 - AVOID THE FAILURES:
Now systematically avoid each failure mode.
For each "way to fail," define its opposite.

STEP 4 - NEGATIVE SPACE:
What's left when you remove all the bad options?
This reveals the path forward.

STEP 5 - SYNTHESIS:
Combine insights into actionable strategy.
What should you DO vs. NOT DO?`
    },
    {
        id: 'ultra_oracle',
        name: '🔮 Oracle Mode',
        category: 'mega',
        recommendedMode: 'matrix',
        useSwarm: true,
        costTier: 'premium',
        description: 'Multi-perspective wisdom synthesis',
        prompt: `ORACLE MODE: Summon multiple expert perspectives.

PERSPECTIVE 1 - THE PRAGMATIST:
What's the practical, get-it-done-today answer?
Focus on immediate actionability.

PERSPECTIVE 2 - THE VISIONARY:
What would the ideal future look like?
Think 10 years ahead. What's the bold move?

PERSPECTIVE 3 - THE SKEPTIC:
What could go wrong? What's everyone missing?
Be the devil's advocate.

PERSPECTIVE 4 - THE HISTORIAN:
What does history teach us about this?
What patterns repeat?

PERSPECTIVE 5 - THE INNOVATOR:
What's the novel approach no one's tried?
How would you disrupt this?

SYNTHESIS - THE ORACLE:
Weave all perspectives into unified wisdom.
Provide clear recommendation with confidence level.

QUESTION FOR THE ORACLE:
{{INPUT}}`
    }
]

// ============================================================
// COST-EFFECTIVE TEMPLATES - Optimized for free models
// ============================================================

export const COST_EFFECTIVE_TEMPLATES = [
    {
        id: 'ce_quick_answer',
        name: '🆓 Quick Answer',
        category: 'analysis',
        recommendedMode: 'sprint',
        costTier: 'free',
        description: 'Fast, efficient responses for simple questions',
        prompt: `Answer concisely and directly: {{INPUT}}

Keep it brief but complete. No fluff.`
    },
    {
        id: 'ce_code_snippet',
        name: '🆓 Code Snippet',
        category: 'code',
        recommendedMode: 'sprint',
        costTier: 'free',
        description: 'Quick code with minimal tokens',
        prompt: `Write this code: {{INPUT}}

Just the code, minimal comments. Keep it clean and short.`
    },
    {
        id: 'ce_outline',
        name: '🆓 Quick Outline',
        category: 'creative',
        recommendedMode: 'sprint',
        costTier: 'free',
        description: 'Fast outline generation',
        prompt: `Create a bullet-point outline for: {{INPUT}}

Use hierarchical bullets. Be concise.`
    },
    {
        id: 'ce_checklist',
        name: '🆓 Instant Checklist',
        category: 'business',
        recommendedMode: 'sprint',
        costTier: 'free',
        description: 'Quick actionable checklist',
        prompt: `Create a checklist for: {{INPUT}}

Format as: [ ] Item
Keep items actionable and specific.`
    },
    {
        id: 'ce_explain_brief',
        name: '🆓 Brief Explainer',
        category: 'learning',
        recommendedMode: 'sprint',
        costTier: 'free',
        description: 'Concise explanation in 3 sentences',
        prompt: `Explain in exactly 3 sentences: {{INPUT}}

Sentence 1: What it is
Sentence 2: Why it matters  
Sentence 3: How to use/apply it`
    },
    {
        id: 'ce_review_fast',
        name: '🆓 Fast Review',
        category: 'code',
        recommendedMode: 'sprint',
        costTier: 'free',
        description: 'Quick code review, top issues only',
        prompt: `Quick review - list top 3 issues only: {{INPUT}}

Format: Issue → Fix (one line each)`
    },
    {
        id: 'ce_improve',
        name: '🆓 One Improvement',
        category: 'creative',
        recommendedMode: 'sprint',
        costTier: 'free',
        description: 'Single highest-impact improvement',
        prompt: `What's the ONE thing that would most improve this? {{INPUT}}

Just the single best improvement with brief rationale.`
    },
    {
        id: 'ce_convert',
        name: '🆓 Quick Convert',
        category: 'code',
        recommendedMode: 'sprint',
        costTier: 'free',
        description: 'Convert between formats/languages',
        prompt: `Convert this: {{INPUT}}

Just output the converted version, nothing else.`
    }
]

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

export function getAllTemplates() {
    return [
        ...MEGA_TEMPLATES,
        ...MULTIPASS_TEMPLATES,
        ...SINGLEPASS_TEMPLATES,
        ...SWARM_TEMPLATES,
        ...CASUAL_TEMPLATES,
        ...ULTRA_COGNITIVE_TEMPLATES,
        ...COST_EFFECTIVE_TEMPLATES
    ]
}

export function getTemplatesByCategory(categoryId) {
    return getAllTemplates().filter(t => t.category === categoryId)
}

export function getTemplateById(id) {
    return getAllTemplates().find(t => t.id === id)
}

export function applyTemplate(template, userInput) {
    return template.prompt.replace(/\{\{INPUT\}\}/g, userInput)
}

export function getRecommendedConfig(template) {
    return {
        mode: template.recommendedMode || 'sprint',
        persona: template.recommendedPersona || 'vibe_coder',
        useSwarm: template.useSwarm || false
    }
}
