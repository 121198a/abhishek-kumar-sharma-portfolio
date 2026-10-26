# Step 4: Camera manager

**Goal:** Smooth, intentional camera that never clips or jumps.

**Needs from the owner:** Nothing special.

## Prompt to paste into the agent

```
Before doing anything, read AGENTS.md and the files it lists (docs/18_PROJECT_BRIEF.md, docs/20_DESIGN_GUARDRAILS.md, docs/blueprint/00_MASTER_RULES.md, 02_TRD.md, 03_ARCHITECTURE.md, 04_DATA_MODEL.md, 10_SECURITY.md).
Do ONLY the task below. Do not start other steps and do not add extra features.
First reply with a short plan: the files you will create or change, and why. Then implement.
At the end: run the real lint, typecheck, test and build scripts that exist in package.json and report the exact results (never claim a check you did not run); update docs/blueprint/15_MICROTASKS.md and 16_CHANGELOG.md; give me a manual test checklist; then STOP and wait for me.

TASK (Step 4: camera system)
1. Create CameraManager in src/engine/ with modes: welcome overview, arrival follow, reception shot, guided follow, room overview, dialogue, manager door, free explore, paused (see docs/blueprint/03_ARCHITECTURE.md).
2. Smooth damped follow and GSAP (or equivalent) transitions. A new camera request supersedes the old transition cleanly.
3. Clamp camera position inside office bounds so it never passes through walls; never jump abruptly between rooms.
4. Switch camera mode automatically from the Experience Director state.
5. Respect a reduced-motion setting (store it in the settings store; shorten or disable transitions).
6. Kill tweens and listeners on unmount.
```

## How you check it yourself
During a walk the camera follows smoothly; on arrival it frames the room; no wall clipping; rapid destination changes never cause a jump or a stuck camera.

## Then commit
```
git add .
git commit -m "step 4: camera manager"
```
