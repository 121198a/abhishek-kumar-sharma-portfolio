# Step 7: MVP checkpoint: reception to IT

**Goal:** Close the first end-to-end loop and test it hard. No new departments.

**Needs from the owner:** Nothing special.

## Prompt to paste into the agent

```
Before doing anything, read AGENTS.md and the files it lists (docs/18_PROJECT_BRIEF.md, docs/20_DESIGN_GUARDRAILS.md, docs/blueprint/00_MASTER_RULES.md, 02_TRD.md, 03_ARCHITECTURE.md, 04_DATA_MODEL.md, 10_SECURITY.md).
Do ONLY the task below. Do not start other steps and do not add extra features.
First reply with a short plan: the files you will create or change, and why. Then implement.
At the end: run the real lint, typecheck, test and build scripts that exist in package.json and report the exact results (never claim a check you did not run); update docs/blueprint/15_MICROTASKS.md and 16_CHANGELOG.md; give me a manual test checklist; then STOP and wait for me.

TASK (Step 7: reception-to-IT vertical slice)
1. Wire the full journey: Welcome -> auto-walk to reception -> receptionist dialogue -> choose IT -> receptionist guides -> arrive in IT -> IT engineer interaction with a short authored conversation (neutral placeholder wording, no invented facts) -> return to reception or continue.
2. Add integration tests: destination -> route -> arrival -> interaction; repeated destination changes; cancellation mid-route; double-click on a choice; skip at every state.
3. Add a Playwright smoke test if feasible; if not, write an exact manual test script in docs/blueprint/13_TESTING.md and say so.
4. Fix any bugs found. Do not add features.
5. Produce a short report: what works, what is placeholder, known issues.
```

## How you check it yourself
You can play the whole journey twice in a row without a refresh and without console errors. Tests pass. The report is honest about placeholders.

## Then commit
```
git add .
git commit -m "step 7: mvp reception to it"
```
