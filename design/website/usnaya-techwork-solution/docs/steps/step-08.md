# Step 8: Free exploration and controls

**Goal:** Second navigation mode on the same Director.

**Needs from the owner:** Nothing special.

## Prompt to paste into the agent

```
Before doing anything, read AGENTS.md and the files it lists (docs/18_PROJECT_BRIEF.md, docs/20_DESIGN_GUARDRAILS.md, docs/blueprint/00_MASTER_RULES.md, 02_TRD.md, 03_ARCHITECTURE.md, 04_DATA_MODEL.md, 10_SECURITY.md).
Do ONLY the task below. Do not start other steps and do not add extra features.
First reply with a short plan: the files you will create or change, and why. Then implement.
At the end: run the real lint, typecheck, test and build scripts that exist in package.json and report the exact results (never claim a check you did not run); update docs/blueprint/15_MICROTASKS.md and 16_CHANGELOG.md; give me a manual test checklist; then STOP and wait for me.

TASK (Step 8: free exploration)
1. Add FREE_EXPLORE: WASD/arrow movement and optional click-to-move, with collision.
2. Add a Guided tour / Free explore toggle in the UI. Switching mid-route cancels the route cleanly.
3. Show a nearby-interaction prompt for characters and doors; E or click interacts; Esc pauses or closes.
4. Ignore movement input while a blocking dialogue is open.
5. Add a controls help panel and a simple minimap showing the visitor and rooms.
6. Tests for mode switching and input blocking.
```

## How you check it yourself
Toggle modes at any time, including mid-walk, without a stuck state. Walking into a character shows the prompt. Movement keys do nothing during dialogue.

## Then commit
```
git add .
git commit -m "step 8: free exploration"
```
