# Step 11: Real 3D assets and asset manager

**Goal:** The slowest step. Premium look depends on real, licensed assets.

**Needs from the owner:** 3D models, rigged characters, animations and their licences. This step cannot finish without them.

## Prompt to paste into the agent

```
Before doing anything, read AGENTS.md and the files it lists (docs/18_PROJECT_BRIEF.md, docs/20_DESIGN_GUARDRAILS.md, docs/blueprint/00_MASTER_RULES.md, 02_TRD.md, 03_ARCHITECTURE.md, 04_DATA_MODEL.md, 10_SECURITY.md).
Do ONLY the task below. Do not start other steps and do not add extra features.
First reply with a short plan: the files you will create or change, and why. Then implement.
At the end: run the real lint, typecheck, test and build scripts that exist in package.json and report the exact results (never claim a check you did not run); update docs/blueprint/15_MICROTASKS.md and 16_CHANGELOG.md; give me a manual test checklist; then STOP and wait for me.

TASK (Step 11: asset pipeline)
Do not download or import any asset with an unknown or non-commercial licence. Ask me for assets or for approval of specific sources.
1. Create an asset manifest (id, path, kind, requiredForMvp, source, license, estimatedBytes) and docs/ASSET_REGISTER.md recording creator, source URL, licence, attribution and commercial-use permission for every asset.
2. Implement AssetManager in src/engine/: cache, progress reporting, fallback placeholder if a GLB fails, optional-asset failure does not crash the app, required-asset failure shows an error with Retry.
3. Load GLB with Meshopt and/or Draco support. Document the gltf-transform (or equivalent) command used to optimise assets.
4. Replace blockout objects with GLB models one department at a time, starting with Reception. Use instancing for repeated furniture. Lazy-load non-critical departments after reception is ready.
5. Replace placeholder characters with rigged GLB models using AnimationMixer with blended idle<->walk transitions, only for assets I provide.
6. Report triangle count, texture sizes and file sizes of what was loaded (real numbers only).
```

## How you check it yourself
Reception shows real models; a deliberately missing GLB falls back to a placeholder; the register lists a licence for every asset.

## Then commit
```
git add .
git commit -m "step 11: assets and asset manager"
```
