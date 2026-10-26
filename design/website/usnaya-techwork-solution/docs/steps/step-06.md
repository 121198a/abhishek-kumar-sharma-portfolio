# Step 6: Reusable character framework

**Goal:** Add characters by config, not by new code.

**Needs from the owner:** Nothing special.

## Prompt to paste into the agent

```
Before doing anything, read AGENTS.md and the files it lists (docs/18_PROJECT_BRIEF.md, docs/20_DESIGN_GUARDRAILS.md, docs/blueprint/00_MASTER_RULES.md, 02_TRD.md, 03_ARCHITECTURE.md, 04_DATA_MODEL.md, 10_SECURITY.md).
Do ONLY the task below. Do not start other steps and do not add extra features.
First reply with a short plan: the files you will create or change, and why. Then implement.
At the end: run the real lint, typecheck, test and build scripts that exist in package.json and report the exact results (never claim a check you did not run); update docs/blueprint/15_MICROTASKS.md and 16_CHANGELOG.md; give me a manual test checklist; then STOP and wait for me.

TASK (Step 6: character framework)
1. Create CharacterDefinition type and CharacterRuntime / CharacterController in src/characters/ (id, displayName, role, departmentId, modelAssetId, animationProfileId, conversationId, movementProfile "stationary" | "patrol" | "guided", aiEnabled default false).
2. Define the roster in src/data/characters.ts: receptionist, IT engineer, IT team lead, HR executive, HR manager, sales executive, sales manager, meeting host, two ambient employees, manager. Use clearly labelled placeholder names (for example "Receptionist (placeholder)") until the owner supplies real names. Use placeholder meshes.
3. Behaviour: a character turns to face the visitor within interaction range and shows a "Talk (E)" prompt. During GUIDED_TRAVEL the receptionist walks ahead and the visitor follows.
4. Prove "config only": add one extra ambient character purely through data, with no new component code, and show it works.
5. Add an AnimationController interface with states idle, walk, greet, talk, listen (placeholders for now: simple bobbing or rotation, clearly labelled).
```

## How you check it yourself
Receptionist leads, visitor follows. Approaching a character shows the Talk prompt and the character faces you. A new character appears by editing data only.

## Then commit
```
git add .
git commit -m "step 6: character framework"
```
