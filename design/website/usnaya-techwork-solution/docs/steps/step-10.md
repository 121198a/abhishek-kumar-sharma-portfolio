# Step 10: Brand identity and UI design

**Goal:** Make the interface look intentional, not templated.

**Needs from the owner:** Logo, brand colors, fonts (or approval of agent's two proposals).

## Prompt to paste into the agent

```
Before doing anything, read AGENTS.md and the files it lists (docs/18_PROJECT_BRIEF.md, docs/20_DESIGN_GUARDRAILS.md, docs/blueprint/00_MASTER_RULES.md, 02_TRD.md, 03_ARCHITECTURE.md, 04_DATA_MODEL.md, 10_SECURITY.md).
Do ONLY the task below. Do not start other steps and do not add extra features.
First reply with a short plan: the files you will create or change, and why. Then implement.
At the end: run the real lint, typecheck, test and build scripts that exist in package.json and report the exact results (never claim a check you did not run); update docs/blueprint/15_MICROTASKS.md and 16_CHANGELOG.md; give me a manual test checklist; then STOP and wait for me.

TASK (Step 10: design system and UI)
Before coding, check whether the owner has supplied brand assets (logo, colors, fonts). If not, STOP and ask; propose two palette + font-pair options (not Inter, Geist or Space Grotesk) and wait for my choice.
Then:
1. Create src/styles/tokens.css: one primary, one secondary, one accent, neutrals, spacing scale, varied radii by component role, typography tokens, motion tokens.
2. Restyle LoadingScreen (real progress), WelcomeScreen (USNAYA Techworks Solutions branding), DialoguePanel, ObjectivePanel, DestinationMenu, SettingsPanel (volume, quality, reduced motion), controls help, minimap.
3. Add skeleton/loading states, error states with Retry, a no-WebGL fallback screen.
4. Follow docs/20_DESIGN_GUARDRAILS.md and list which guardrails you checked and any you broke on purpose.
5. Check contrast, focus visibility and prefers-reduced-motion.
```

## How you check it yourself
UI looks branded and consistent; no neon/purple gradients, emoji icons or glass-everywhere; keyboard focus is visible; reduced-motion works.

## Then commit
```
git add .
git commit -m "step 10: design system and ui"
```
