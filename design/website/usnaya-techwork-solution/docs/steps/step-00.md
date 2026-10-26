# Step 0: Audit and scaffold

**Goal:** Create the runnable project base. Maps to blueprint Phase 1.

**Needs from the owner:** Nothing special.

## Prompt to paste into the agent

```
Before doing anything, read AGENTS.md and the files it lists (docs/18_PROJECT_BRIEF.md, docs/20_DESIGN_GUARDRAILS.md, docs/blueprint/00_MASTER_RULES.md, 02_TRD.md, 03_ARCHITECTURE.md, 04_DATA_MODEL.md, 10_SECURITY.md).
Do ONLY the task below. Do not start other steps and do not add extra features.
First reply with a short plan: the files you will create or change, and why. Then implement.
At the end: run the real lint, typecheck, test and build scripts that exist in package.json and report the exact results (never claim a check you did not run); update docs/blueprint/15_MICROTASKS.md and 16_CHANGELOG.md; give me a manual test checklist; then STOP and wait for me.

TASK (Step 0: audit and scaffold)
1. Inspect the current folder and git status. Report what exists.
2. If this is a new project (only AGENTS.md and docs/ exist): scaffold Vite + React + TypeScript in the CURRENT folder (no nested folder). Keep AGENTS.md and docs/ untouched.
3. Install: three, @react-three/fiber, @react-three/drei, zustand, xstate, @xstate/react, gsap, howler, vitest, plus matching @types packages. Check peer-dependency compatibility between React and @react-three/fiber / drei. Do not force-install. Tell me the exact versions chosen.
4. Create src/ folders: app, components, experience, engine, world/departments, characters, dialogue/conversations, navigation, data, services, store, tests.
5. Add .gitignore (node_modules, dist, .env, .env.local) and .env.example with placeholders only. Run git init and make a first commit if there is no repo.
6. Build a full-screen R3F Canvas with one clearly labelled primitive (a rotating cube), a loading fallback, and an error boundary that shows a readable message if WebGL is unavailable.
7. Make sure npm scripts exist for dev, build, lint, typecheck and test.
```

## How you check it yourself
npm run dev opens a page with a rotating cube. npm run build passes. npm test runs (even with one trivial test). Disabling WebGL (or simulating it) shows the fallback message, not a blank screen.

## Then commit
```
git add .
git commit -m "step 0: scaffold"
```
