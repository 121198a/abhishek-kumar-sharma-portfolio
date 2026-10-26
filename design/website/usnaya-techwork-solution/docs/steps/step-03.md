# Step 3: Visitor, waypoints and collision

**Goal:** A placeholder visitor walks routes and cannot pass walls.

**Needs from the owner:** Nothing special.

## Prompt to paste into the agent

```
Before doing anything, read AGENTS.md and the files it lists (docs/18_PROJECT_BRIEF.md, docs/20_DESIGN_GUARDRAILS.md, docs/blueprint/00_MASTER_RULES.md, 02_TRD.md, 03_ARCHITECTURE.md, 04_DATA_MODEL.md, 10_SECURITY.md).
Do ONLY the task below. Do not start other steps and do not add extra features.
First reply with a short plan: the files you will create or change, and why. Then implement.
At the end: run the real lint, typecheck, test and build scripts that exist in package.json and report the exact results (never claim a check you did not run); update docs/blueprint/15_MICROTASKS.md and 16_CHANGELOG.md; give me a manual test checklist; then STOP and wait for me.

TASK (Step 3: visitor movement)
1. Add a placeholder visitor (capsule) with a floating "YOU" label, clearly marked as placeholder.
2. Implement WaypointNavigator in src/navigation/: constant speed, turn to face movement direction, stop at the end.
3. Define waypoint routes (Entrance -> Reception, Reception -> every department) in src/data/destinations.ts; validate that every route's waypoints exist and every department is reachable.
4. Add simple AABB collision in src/world/CollisionWorld.ts so the visitor cannot walk through walls.
5. Emit navigation:started and navigation:arrived through the Director only. A new route cancels the current one; stale callbacks from a cancelled route are ignored.
6. Unit-test the pure logic (route progress, cancellation, reachability).
```

## How you check it yourself
From the debug panel choose a destination: the capsule walks there and stops. Choosing another destination mid-walk switches cleanly. It cannot cross walls.

## Then commit
```
git add .
git commit -m "step 3: visitor and waypoint navigation"
```
