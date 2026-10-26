# Release Notes: USNAYA Techworks Solution 3D Project

## Setup
```
npm ci
cp .env.example .env      # optional; defaults work with the local provider
npm run dev               # web app and API together on http://localhost:5173
```
Separate API process (for production-style runs): `npm run dev:server` (default port 8787).

## Environment variables (names only)
`VITE_APP_NAME` (public), `PORT`, `ALLOWED_ORIGINS`, `AI_PROVIDER` (`local` or `anthropic`), `AI_PROVIDER_API_KEY`, `AI_PROVIDER_MODEL`, `DAILY_REQUEST_CAP`. Secrets never go in `VITE_` variables.

## Commands
`npm run typecheck`, `npm run lint`, `npm test`, `npm run build`, `npm run preview`.
Browser check (needs a running dev server and Playwright): `BASE_URL=http://127.0.0.1:5173 node scripts/e2e.mjs`.

## Deployment
No hosting platform is fixed by the repository. The build is a static site (`dist/`) plus a Node API (`server/`, run with `npx tsx server/index.ts`). Serve `dist/` from any static host and route `/api` and `/health` to the Node server (the front end calls the relative path `/api/conversations/message`), set `ALLOWED_ORIGINS` to the site's origin, and add `frame-ancestors` and HSTS at the host. The CSP is already embedded in the production `index.html`; if the site is served from another origin than the API, widen `connect-src`.

## Rollback
Git: each phase is one commit; `git revert <sha>` or `git reset --hard <previous sha>`. Checkpoint ZIPs: `..._checkpoint1.zip`, `..._phase3.zip`. For a deployment, redeploy the previous `dist/`.

## File-change summary (this release after Phase 3)
`src/engine/VoiceManager.ts` (rewritten), `src/components/DialoguePanel.tsx` (voice controls, notes), `src/styles/app.css`, `vite.config.ts` (CSP), `eslint.config.js` (lints `.mjs`), `scripts/e2e.mjs` (new), tests `voice`, `chat`, `movement` (new), docs (this and the audit/asset/VR/report files).

## Known limitations
See `PHASES_4_13_REPORT.md` and `SECURITY_AUDIT.md`. Headline items: no VR; real-GPU performance, physical-phone use, audible voice and screen readers untested; characters are stylised procedural figures; five of six named people have no supplied job title.
