# Step 2: Experience Director (state machine) and typed events

**Goal:** Build the project's brain before any gameplay.

**Needs from the owner:** Nothing special.

## Prompt to paste into the agent

```
Before doing anything, read AGENTS.md and the files it lists (docs/18_PROJECT_BRIEF.md, docs/20_DESIGN_GUARDRAILS.md, docs/blueprint/00_MASTER_RULES.md, 02_TRD.md, 03_ARCHITECTURE.md, 04_DATA_MODEL.md, 10_SECURITY.md).
Do ONLY the task below. Do not start other steps and do not add extra features.
First reply with a short plan: the files you will create or change, and why. Then implement.
At the end: run the real lint, typecheck, test and build scripts that exist in package.json and report the exact results (never claim a check you did not run); update docs/blueprint/15_MICROTASKS.md and 16_CHANGELOG.md; give me a manual test checklist; then STOP and wait for me.

TASK (Step 2: Experience Director)
1. Implement the Experience Director with XState in src/experience/ (ExperienceMachine.ts, ExperienceDirector.ts, ExperienceEvents.ts, ExperienceConfig.ts).
2. States: LOADING, WELCOME, ARRIVAL, RECEPTION, DESTINATION_CHOICE, GUIDED_TRAVEL, FREE_EXPLORE, DESTINATION_ARRIVAL, CHARACTER_INTERACTION, DIALOGUE, MANAGER_DOOR, MANAGER_DIALOGUE, EXIT, plus PAUSED handling.
3. Typed events: destination:selected, navigation:started, navigation:arrived, character:nearby, interaction:started, dialogue:started, dialogue:completed, door:knocked, door:opened, experience:paused, experience:resumed, skip:requested, asset:failed, conversation:failed. Every event has a typed payload.
4. Rules: a new destination:selected during GUIDED_TRAVEL cancels the old route; duplicate events are ignored; skip always lands on a valid state; only the Director approves state changes.
5. Expose the machine state to React through a Zustand store (src/store/experienceStore.ts).
6. Add a dev-only debug panel with a button per event and the current state shown. It must not ship in production builds.
7. Write vitest tests for legal and illegal transitions, cancellation, duplicate events, and skip.
```

## How you check it yourself
Debug panel shows state changing on each button; illegal transitions are ignored; tests pass; production build excludes the debug panel.

## Then commit
```
git add .
git commit -m "step 2: experience director"
```
