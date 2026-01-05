# 🧠 The Neural Construct

> **Tactical Agentic Workspace for Advanced Reasoning**  
> *Engineered by Warrenet*

![System Status](https://img.shields.io/badge/SYSTEM-ONLINE-00ff88?style=for-the-badge)
![Encryption](https://img.shields.io/badge/ENCRYPTION-AES256-00d4ff?style=for-the-badge)
![Reasoning](https://img.shields.io/badge/REASONING-MATRIX-aa44ff?style=for-the-badge)

A cyberpunk-themed Progressive Web App (PWA) designed for high-level cognitive workflows. It leverages multi-pass reasoning strategies, swarm intelligence, and persona-based architecture to solve complex problems.

![UI Preview](public/vite.svg) *// Replace with actual screenshot*

## ⚡ Core Features

### 🏛️ The Council
Three specialized agents with distinct cognitive architectures:
- **The Architect**: Systems thinking, schema design, high-level planning.
- **The Vibe Coder**: Production-ready code generation with modern best practices.
- **Based Strategist**: Security audits, risk assessment, and ruthless optimization.

### 🔀 Advanced Reasoning Modes
- **SPRINT**: Single-shot, low-latency responses.
- **DEEP**: Chain-of-Thought (CoT) with visible `<thinking>` tags.
- **MATRIX**: 3-branch parallel analysis (Architecture/Implementation/Risks) with synthesis.
- **REFLECT**: Iterative self-critique loop for quality refinement.
- **DEBATE**: Adversarial "Advocate vs. Critic" protocol handled by a Judge.
- **RED TEAM**: Vulnerability attack simulation + Blue Team hardening.
- **RUBRIC**: Automated scoring against quality standards (Auto-fix < 85%).
- **SOCRATIC**: Question-driven deep analysis.

### 🐝 Swarm Mode
Activates a sequential collaboration pipeline where all three agents work on a single problem:
`Architect (Design)` → `Vibe Coder (Implement)` → `Strategist (Review)`

### 🛠️ Tactical Tools
- **The Vault**: Client-side, encrypted API key storage (never hits a backend).
- **Template Library**: 50+ pre-built prompts for code, security, and analysis.
- **Status HUD**: Real-time monitoring of connection, tokens, and stream status.
- **Toast System**: Visual feedback for all system actions.

## 🚀 Deployment

### Prerequisites
- Node.js 18+
- OpenRouter API Key

### Local Installation
```bash
# Clone the repository
git clone https://github.com/warrenet/neural-construct.git

# Install dependencies
npm install

# Start the neural interface (Frontend + Proxy Server)
npm start
```

Access the terminal at: `http://localhost:5173`

## 🔐 Security Protocols
- **Zero-Knowledge Backend**: The proxy server forwards requests but never logs keys or body content.
- **Local Vault**: API keys are stored in browser IndexedDB, not cookies or local storage.
- **Client-Side History**: Chat sessions reside in your local browser state.

## 🤝 Contributing
1. Fork the construct.
2. Create your feature branch: `git checkout -b feature/new-module`
3. Commit changes: `git commit -m 'Add new module'`
4. Push to the branch: `git push origin feature/new-module`
5. Initiate Pull Request.

---
*© 2026 Warrenet. All systems nominal.*
