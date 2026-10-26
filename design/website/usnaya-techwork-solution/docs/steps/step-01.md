# Step 1: Office blockout from data

**Goal:** Prove the floor plan with boxes only. No beauty yet.

**Needs from the owner:** Nothing special.

## Prompt to paste into the agent

```
Before doing anything, read AGENTS.md and the files it lists (docs/18_PROJECT_BRIEF.md, docs/20_DESIGN_GUARDRAILS.md, docs/blueprint/00_MASTER_RULES.md, 02_TRD.md, 03_ARCHITECTURE.md, 04_DATA_MODEL.md, 10_SECURITY.md).
Do ONLY the task below. Do not start other steps and do not add extra features.
First reply with a short plan: the files you will create or change, and why. Then implement.
At the end: run the real lint, typecheck, test and build scripts that exist in package.json and report the exact results (never claim a check you did not run); update docs/blueprint/15_MICROTASKS.md and 16_CHANGELOG.md; give me a manual test checklist; then STOP and wait for me.

TASK (Step 1: office blockout driven by data)
1. Create src/data/departments.ts with typed zone config: id, name, center, size, entryWaypointId, cameraPreset. Follow docs/blueprint/04_DATA_MODEL.md types.
2. Floor plan (conceptual, adjust sizes after viewing): Main Entrance -> Reception -> central corridor hub. From the hub: IT, HR, Sales, Conference Hall, Waiting Lounge, Kitchen/Break Area, and an Executive Zone containing the Manager's Cabin with a door gap.
3. Generate the blockout from that data using boxes/planes with flat colors and floating text labels per zone. Add walls with door gaps so corridors are walkable. No characters.
4. Temporary elevated perspective camera looking at the whole office.
5. Add a data validator (unique ids, all references resolve) with unit tests.
6. Clearly label the scene as BLOCKOUT in code comments and a small on-screen tag.
```

## How you check it yourself
All rooms visible with labels; door gaps exist; validator tests pass; changing a zone's position in departments.ts moves it in the scene.

## Then commit
```
git add .
git commit -m "step 1: office blockout"
```
