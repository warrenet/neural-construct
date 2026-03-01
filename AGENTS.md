# AGENTS.md — Neural Construct
*Deploy to: project root of Neural Construct repo*
*Last updated: S81 | 2026-03-01*

---

## What This Is

Neural Construct is Warren's cyberpunk-themed tactical agentic workspace — a PWA built with React 19 + Vite + Three.js frontend and an Express.js backend. Features The Council (3 specialized agents), 8 reasoning modes, swarm collaboration, and client-side encrypted key storage (The Vault). Deployed to Vercel.

---

## System Architecture

```
Browser client (React 19 + Vite + Three.js)
    ↓
Express.js backend (server/index.js)
    ↓
AI provider layer (multi-model routing)
    ↓
Supabase (optional cloud memory)
```

---

## The Council — Agent Roster

| Agent | Role |
|-------|------|
| The Architect | Systems thinking, schema design, high-level planning |
| The Vibe Coder | Production-ready code generation |
| Based Strategist | Security audits, risk assessment, optimization |

**Swarm Mode:** Sequential pipeline — Architect → Vibe Coder → Strategist

---

## Reasoning Modes

SPRINT · DEEP · MATRIX · REFLECT · DEBATE · RED TEAM · RUBRIC · SOCRATIC

---

## Stack

- **Frontend:** React 19 + Vite + Tailwind v4 + Three.js + react-force-graph-3d
- **Backend:** Express.js (`server/index.js`)
- **Storage:** Supabase (cloud), idb-keyval (local), client-side AES-256 Key Vault
- **Deployment:** Vercel (`vercel.json`)

---

## Key Files

| File/Dir | Purpose |
|----------|---------|
| `src/App.jsx` | Root component, routing, global state |
| `server/index.js` | Express API server — model routing + streaming |
| `src/components/KeyVault.jsx` | Client-side encrypted API key storage — never log |
| `src/components/ChatStream.jsx` | Streaming response handler |
| `src/components/SwarmToggle.jsx` | Swarm mode activation |
| `src/components/ModelSelector.jsx` | Multi-model switching UI |
| `src/components/CortexVisualizer.jsx` | Three.js neural graph visualization |
| `src/components/CommandPalette.jsx` | Keyboard-driven command interface |
| `supabase_setup.sql` | DB schema — run once during setup |
| `vercel.json` | Deployment config — do not touch |

---

## Rules

**Before declaring done:**
1. Run `npm run build` — zero errors, zero TypeScript/ESLint failures
2. Verify `server/index.js` starts cleanly: `npm run server`
3. Test streaming in browser — full response, no truncation
4. Check Vercel preview deploy builds cleanly

**Never:**
- Log or expose API keys — The Vault is the only key storage
- Add server-side session state — streaming architecture is stateless
- Modify reasoning mode logic (MATRIX, SWARM, etc.) without a full test pass
- Break the Council agent separation — each agent has a defined cognitive role
- Add new npm dependencies without explicit approval (bundle size matters)

**Always:**
- Create rollback tag before major changes: `git tag pre-codex-$(date +%s)`
- Keep The Vault isolated — no API keys in localStorage, logs, or network calls
- Functional components + hooks only — no class components
- Test both streaming and non-streaming response paths

---

## Commit Message Format

```
fix: <description>
feat: <description>
refactor: <description>
```

---

## Test Commands

```bash
npm run build     # must succeed with zero errors
npm run lint      # zero ESLint violations
npm run server    # backend starts cleanly
```

---

## Coding Standards

- React 19 functional components + hooks only
- Tailwind v4 utility classes — no custom CSS unless unavoidable
- Async: `async/await` throughout, no `.then()` chains
- No `any` types or implicit globals
- Error boundaries: `ErrorBoundary.jsx` wraps all major panels

---

## Protected Files

- `vercel.json` — deployment config (do not modify without explicit instruction)
- `supabase_setup.sql` — DB schema (run once, do not modify after deploy)
- `src/components/KeyVault.jsx` — encrypted key storage (high security, high impact)
- `.env` / API keys — never touch, never log

---

*This file is read by Codex before every task. Keep it current.*
