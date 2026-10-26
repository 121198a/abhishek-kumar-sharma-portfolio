# Step 5: Dialogue system and reception conversation

**Goal:** Authored pop-up chat that drives the Director, not navigation directly.

**Needs from the owner:** Nothing special.

## Prompt to paste into the agent

```
Before doing anything, read AGENTS.md and the files it lists (docs/18_PROJECT_BRIEF.md, docs/20_DESIGN_GUARDRAILS.md, docs/blueprint/00_MASTER_RULES.md, 02_TRD.md, 03_ARCHITECTURE.md, 04_DATA_MODEL.md, 10_SECURITY.md).
Do ONLY the task below. Do not start other steps and do not add extra features.
First reply with a short plan: the files you will create or change, and why. Then implement.
At the end: run the real lint, typecheck, test and build scripts that exist in package.json and report the exact results (never claim a check you did not run); update docs/blueprint/15_MICROTASKS.md and 16_CHANGELOG.md; give me a manual test checklist; then STOP and wait for me.

TASK (Step 5: authored dialogue)
1. Implement DialogueSchema.ts (DialogueNode, DialogueChoice, ConversationDefinition per docs/blueprint/04_DATA_MODEL.md), DialogueManager.ts, and DialogueValidator.ts (missing nodes, dead ends, unreachable nodes, unknown speakers).
2. Build DialoguePanel.tsx in accessible HTML/CSS at the lower part of the screen: speaker name, role, text, keyboard-accessible choices, visible focus, aria-live for new messages. Keep it plain; final styling comes in Step 10.
3. Author "reception-intro" in src/dialogue/conversations/: the receptionist says "Welcome to USNAYA Techworks Solutions. How may I help you?" with choices for IT, HR, Sales, Conference Hall, Waiting Area, Kitchen, Manager's Cabin, and "Just exploring". Use only neutral wording. Do not invent company facts.
4. Choices emit destination:selected through the Director. They never call navigation directly.
5. Only one dialogue can be active. Add a Skip control that lands on a valid state.
6. Validate all conversations at startup in development and in tests.
```

## How you check it yourself
Reception dialogue opens; clicking a choice makes the visitor walk to that room; keyboard Tab/Enter works; Skip works; the validator fails on a deliberately broken test conversation.

## Then commit
```
git add .
git commit -m "step 5: dialogue system"
```
