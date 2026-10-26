# USNAYA Techworks Solution 3D Project: Interactive 3D Virtual Office

You are the senior engineer on this project. These rules apply to every task, every session.

## Product (one paragraph)
A desktop-first, browser-based, guided 3D virtual office for the company "USNAYA Techworks Solutions" (project title: "USNAYA Techworks Solution 3D Project"). A visitor enters, meets a receptionist, chooses a destination (IT, HR, Sales, Conference Hall, Waiting Lounge, Kitchen/Break Area, Manager's Cabin), is guided there by a character, talks to role-based characters through authored dialogue (pop-up chat panel) and optional AI text chat, and can also explore freely. Premium, realistic-feeling architecture with optimized human characters.

## Read before working
1. docs/00_READ_ME_FIRST.md
2. docs/18_PROJECT_BRIEF.md (what the owner wants)
3. docs/blueprint/00_MASTER_RULES.md, 01_PRD, 02_TRD, 03_ARCHITECTURE, 04_DATA_MODEL, 08_UI_SPEC, 09_ERROR_HANDLING, 10_SECURITY, 13_TESTING
4. docs/20_DESIGN_GUARDRAILS.md and docs/21_LAUNCH_READINESS.md
5. The current step file in docs/steps/

## Working protocol
- Do ONLY the step you are given. Do not start later steps. Do not add unrequested features.
- First reply: a short plan (files to create/change and why). Then implement the smallest end-to-end increment.
- Inspect the repo before editing. Never overwrite working code without saying so.
- At the end: run the real lint / typecheck / test / build scripts that exist, report exact results, never claim unexecuted checks passed.
- Update docs/blueprint/15_MICROTASKS.md and 16_CHANGELOG.md. Record architecture changes in 17_DECISIONS.md.
- Give the owner a manual test checklist, then STOP and wait.

## Architecture rules
- React owns UI (HTML/CSS). The 3D runtime owns scene objects. The ExperienceDirector (typed state machine) owns progression.
- Systems talk through typed events. No business logic in room components or buttons.
- All content (departments, destinations, characters, dialogue, assets) is typed config in src/data, validated at startup/tests.
- One primary conversation at a time. A new destination cancels the old route cleanly. Duplicate clicks never trigger duplicate actions.
- Strict TypeScript, no `any`.
- Rendering never waits on the network. Dispose GPU resources, listeners and tweens on unmount.

## Security and truthfulness
- No secrets in client code or git. Server-only .env; commit .env.example with placeholders.
- AI output is untrusted: schema-validate, allow-list actions, render as plain text, never execute, never touch the scene directly. The Director revalidates every action.
- Do NOT invent company facts, services, staff, clients, certifications, policies, test results or deployment status. Use clearly labelled placeholders.
- Only licensed assets; record source and licence for every asset. Label placeholders honestly.
- Out of scope: scraping, AdMob/ads, database (until an approved persistence need exists), unapproved analytics.

## Design rules (avoid generic "AI-looking" UI)
See docs/20_DESIGN_GUARDRAILS.md. In short: one controlled brand palette, deliberate typography (not default Inter/Geist/Space Grotesk), no neon/purple gradients, no emoji icons, no glass everywhere, no three-identical-cards layouts, purposeful motion only, respect prefers-reduced-motion.
