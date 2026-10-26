# Step 16: Mobile optimization (after desktop is accepted)

**Goal:** Touch and low-power support as a separate round.

**Needs from the owner:** Target phone models and browsers.

## Prompt to paste into the agent

```
Before doing anything, read AGENTS.md and the files it lists (docs/18_PROJECT_BRIEF.md, docs/20_DESIGN_GUARDRAILS.md, docs/blueprint/00_MASTER_RULES.md, 02_TRD.md, 03_ARCHITECTURE.md, 04_DATA_MODEL.md, 10_SECURITY.md).
Do ONLY the task below. Do not start other steps and do not add extra features.
First reply with a short plan: the files you will create or change, and why. Then implement.
At the end: run the real lint, typecheck, test and build scripts that exist in package.json and report the exact results (never claim a check you did not run); update docs/blueprint/15_MICROTASKS.md and 16_CHANGELOG.md; give me a manual test checklist; then STOP and wait for me.

TASK (Step 16: mobile)
1. Add a mobile quality profile (lower pixel ratio, fewer shadows and ambient characters, smaller textures).
2. Add touch controls: tap-to-move and an optional on-screen joystick; larger tap targets; safe-area handling; portrait and landscape layouts for the dialogue panel and menus.
3. Camera framing for narrow viewports.
4. Test on real devices or emulators and report which were actually tested. Label mobile support status honestly (supported / limited / unsupported).
```

## How you check it yourself
The full journey is playable by touch on at least the devices you test. The status label matches reality.

## Then commit
```
git add .
git commit -m "step 16: mobile"
```
