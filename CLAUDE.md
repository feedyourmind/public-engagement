# Project: AI X-Risk Spectrum (Eversell)

## Dev Server vs Build

**Always use the dev server (`npm run dev`) for real-time changes.** Next.js with Turbopack provides instant hot reload — edits to components, pages, styles, etc. are reflected immediately in the browser without a manual rebuild.

- **`npm run dev`** — Start dev server on port 3333 with hot reload. Use this for all development.
- **`npm run build`** — Full production build. Only needed to verify production behavior, catch build-only errors, or before deployment.
- **`npm run rebuild`** — Kills port 3333, builds, and starts production server. Use only for final verification.

**When to rebuild:**
- Adding/removing dependencies (`npm install`)
- Changing `next.config.ts`, `tsconfig.json`, or `postcss.config.mjs`
- Verifying production-specific behavior (static generation, metadata, etc.)
- Before deployment

**When NOT to rebuild (dev server handles it):**
- Editing components, pages, sections, utils, context, types
- Adding new pages/routes
- Changing styles (Tailwind classes, globals.css)
- Any HTML/JSX/CSS change

**Before making changes:** Check if the dev server is running on port 3333 (`lsof -ti:3333`). If not, start it with `npm run dev`. If a production server is running instead, kill it and start the dev server.
