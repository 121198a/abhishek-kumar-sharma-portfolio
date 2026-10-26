# Step 12: Lighting, materials and performance

**Goal:** Luxury feel and stable frame rate.

**Needs from the owner:** Reference desktop (CPU, GPU, browser) for FPS targets.

## Prompt to paste into the agent

```
Before doing anything, read AGENTS.md and the files it lists (docs/18_PROJECT_BRIEF.md, docs/20_DESIGN_GUARDRAILS.md, docs/blueprint/00_MASTER_RULES.md, 02_TRD.md, 03_ARCHITECTURE.md, 04_DATA_MODEL.md, 10_SECURITY.md).
Do ONLY the task below. Do not start other steps and do not add extra features.
First reply with a short plan: the files you will create or change, and why. Then implement.
At the end: run the real lint, typecheck, test and build scripts that exist in package.json and report the exact results (never claim a check you did not run); update docs/blueprint/15_MICROTASKS.md and 16_CHANGELOG.md; give me a manual test checklist; then STOP and wait for me.

TASK (Step 12: lighting and performance)
1. Add architectural lighting: ambient/hemisphere plus one main shadow-casting directional light, warm accent lights, baked lighting where the asset pipeline allows.
2. Apply consistent PBR materials (wood, glass, stone, metal, fabric) with reused materials.
3. Add subtle ambient animation (typing employees, plants, monitors) where assets support it.
4. Add PerformanceManager: device/GPU hints, quality tiers (shadows, pixel ratio cap, ambient character count), a dev-only FPS monitor, and a quality setting in SettingsPanel.
5. Dispose geometries, materials, textures and listeners correctly; test re-entering the scene for memory growth.
6. Tell me exactly how to measure FPS on my machine. Do not invent FPS numbers.
```

## How you check it yourself
Looks cohesive; quality tiers visibly change shadows/DPR; I can record real FPS numbers on my reference device.

## Then commit
```
git add .
git commit -m "step 12: lighting and performance"
```
