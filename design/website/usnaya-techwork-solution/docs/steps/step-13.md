# Step 13: Audio

**Goal:** Event-driven sound with browser autoplay handled.

**Needs from the owner:** Licensed audio files (or approval to ship silent).

## Prompt to paste into the agent

```
Before doing anything, read AGENTS.md and the files it lists (docs/18_PROJECT_BRIEF.md, docs/20_DESIGN_GUARDRAILS.md, docs/blueprint/00_MASTER_RULES.md, 02_TRD.md, 03_ARCHITECTURE.md, 04_DATA_MODEL.md, 10_SECURITY.md).
Do ONLY the task below. Do not start other steps and do not add extra features.
First reply with a short plan: the files you will create or change, and why. Then implement.
At the end: run the real lint, typecheck, test and build scripts that exist in package.json and report the exact results (never claim a check you did not run); update docs/blueprint/15_MICROTASKS.md and 16_CHANGELOG.md; give me a manual test checklist; then STOP and wait for me.

TASK (Step 13: audio)
1. Add AudioManager with Howler: ambience, footsteps, door/knock, UI sounds, optional voice lines. Sounds are triggered by Director events (for example door:knocked), never by timestamps.
2. Handle the browser autoplay restriction: start audio after the first user interaction and show an enable-audio control if blocked.
3. Global mute and volume saved in settings. If a sound file is missing, fail silently and log a diagnostic.
4. Use only licensed audio; record each in docs/ASSET_REGISTER.md. If voice lines are added, also provide captions or transcripts.
```

## How you check it yourself
Mute/volume persist across refresh; no audio before first click; a missing file does not break anything.

## Then commit
```
git add .
git commit -m "step 13: audio"
```
