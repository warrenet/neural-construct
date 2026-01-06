---
description: How to start development on this project
---

# Development Workflow

## First Time Setup

1. Copy `.env.example` to `.env`
2. Add your OpenRouter API key to `.env`
3. Run `npm install`
4. Run `npm start`

## Daily Development

// turbo

1. Run `npm start` to start dev server
2. Make changes - Vite hot-reloads automatically
3. If you change `.env`, restart the server (Ctrl+C, then `npm start`)

## Environment Variables

- Changes to `.env` require server restart
- Changes to code files reload automatically (HMR)

## Troubleshooting

- **"User not found" error**: Your API key is invalid or missing
- **No response**: Check browser console for errors
- **Models not working**: Try a different free model in sidebar
