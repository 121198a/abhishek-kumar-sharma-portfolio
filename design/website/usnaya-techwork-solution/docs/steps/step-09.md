# Step 9: All departments and the manager's cabin

**Goal:** Expand by content, not new engine code.

**Needs from the owner:** Nothing special.

## Prompt to paste into the agent

```
Before doing anything, read AGENTS.md and the files it lists (docs/18_PROJECT_BRIEF.md, docs/20_DESIGN_GUARDRAILS.md, docs/blueprint/00_MASTER_RULES.md, 02_TRD.md, 03_ARCHITECTURE.md, 04_DATA_MODEL.md, 10_SECURITY.md).
Do ONLY the task below. Do not start other steps and do not add extra features.
First reply with a short plan: the files you will create or change, and why. Then implement.
At the end: run the real lint, typecheck, test and build scripts that exist in package.json and report the exact results (never claim a check you did not run); update docs/blueprint/15_MICROTASKS.md and 16_CHANGELOG.md; give me a manual test checklist; then STOP and wait for me.

TASK (Step 9: connected office and manager sequence)
1. Block out HR, Sales, Conference Hall, Waiting Lounge, Kitchen/Break Area and Manager's Cabin with simple furniture placeholders (desks, sofas, conference table, kitchen counter, manager desk). Each room needs stable ids, entry/exit waypoints, collision boundaries, a camera preset, a directory entry and a short authored interaction (neutral placeholder text).
2. Manager's Cabin sequence: arrive -> Knock action (one-shot, cannot double-fire) -> short wait -> permission -> animated door open -> camera moves inside -> "manager-intro" dialogue. Handle skip and cancel.
3. Add a graph test that every room is reachable from reception and the visitor can return to reception.
4. Do not polish visuals.
```

## How you check it yourself
Every room is reachable by guided and free mode. The knock sequence works once per attempt, even if you spam the button. Return to reception works.

## Then commit
```
git add .
git commit -m "step 9: all departments and manager cabin"
```
