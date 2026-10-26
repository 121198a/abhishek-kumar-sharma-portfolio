# Step 15: QA, production readiness and deploy

**Goal:** Audit against the checklists and ship honestly.

**Needs from the owner:** Real contact info, domain, hosting choice, legal review.

## Prompt to paste into the agent

```
Before doing anything, read AGENTS.md and the files it lists (docs/18_PROJECT_BRIEF.md, docs/20_DESIGN_GUARDRAILS.md, docs/blueprint/00_MASTER_RULES.md, 02_TRD.md, 03_ARCHITECTURE.md, 04_DATA_MODEL.md, 10_SECURITY.md).
Do ONLY the task below. Do not start other steps and do not add extra features.
First reply with a short plan: the files you will create or change, and why. Then implement.
At the end: run the real lint, typecheck, test and build scripts that exist in package.json and report the exact results (never claim a check you did not run); update docs/blueprint/15_MICROTASKS.md and 16_CHANGELOG.md; give me a manual test checklist; then STOP and wait for me.

TASK (Step 15: release)
1. Audit the project against docs/21_LAUNCH_READINESS.md and docs/blueprint/14_PRODUCTION_CHECKLIST.md. Report every item as Done / Not applicable / Needs owner input, with evidence.
2. Fix gaps: error boundaries, loading/empty/failed/timeout states, duplicate-submission prevention, security headers (CSP that works with WebGL and the asset hosts), caching headers, code splitting, asset compression, custom 404, meta title/description, Open Graph image, favicon set, robots.txt, sitemap.xml, canonical URLs, alt text.
3. Privacy Policy and Terms: create clearly marked drafts for the owner and legal review only. You are not a lawyer; do not present them as final. Add cookie consent only if non-essential cookies or analytics are used. Add analytics only if I approve.
4. Run the real tests/build and a browser smoke test. List the browsers I must test manually (Chrome, Edge, Safari, Firefox).
5. Verify no secrets in the client bundle or git history; verify asset licences and that company facts are owner-approved.
6. Write README setup/deployment instructions, a rollback plan, and an honest release report with known limitations. Do not mark unimplemented features complete.
```

## How you check it yourself
Checklist report has no hidden 'Done'. Production build has no secrets. Release report lists real limitations.

## Then commit
```
git add .
git commit -m "step 15: release readiness"
```
