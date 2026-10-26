# READ ME FIRST

## Hinglish quick guide (owner ke liye)
- Agent ko is chat ki koi baat nahi pata. Wo sirf is folder ki files padhta hai. Isliye poora idea yahan files mein hai.
- Kaam ka tarika: `START_HERE_PROMPT.md` ka prompt paste karo -> agent samajh gaya ya nahi check karo -> phir `docs/steps/step-00.md` ka prompt paste karo -> `npm run dev` se khud check karo -> `git commit` -> agla step.
- Ek time par sirf ek step. Fail hua step pass hone se pehle agla mat chalao.
- Agent kuch tod de to `git log` se pichle commit par wapas jao.

## Folder map
- `AGENTS.md` (root): permanent rules. Agent ko ye hamesha dikhni chahiye.
- `docs/18_PROJECT_BRIEF.md`: aapka original idea, English mein.
- `docs/19_REFERENCE_VIDEO_ANALYSIS.md`: reference video mein jo verified hai aur jo sirf anumaan hai.
- `docs/20_DESIGN_GUARDRAILS.md`: "vibe-coded look" se bachne ke rules.
- `docs/21_LAUNCH_READINESS.md`: public karne se pehle ke checks.
- `docs/steps/`: 17 step-by-step prompts (step-00 ... step-16).
- `docs/blueprint/`: aapka uploaded blueprint pack (PRD, TRD, architecture, data model, security, testing, phase prompts).

## How the two plans fit together
`docs/blueprint/prompts/` has 7 coarse phases. `docs/steps/` splits the same work into smaller steps so the agent makes fewer mistakes per prompt.

| Blueprint phase | Steps |
|---|---|
| 1 Audit and foundation | 0, 1 |
| 2 Reception vertical slice | 2, 3, 4, 5, 6 |
| 3 Navigation and characters | 6, 7, 8 |
| 4 Dialogue and AI | 5, 14 |
| 5 World expansion | 9 |
| 6 Visual polish | 10, 11, 12, 13 |
| 7 QA and release | 15 (mobile: 16) |

Where the two differ, the stricter rule wins. Where analytics, database or backend choices differ, nothing is added without the owner's approval.

## Open decisions the owner must supply (agent must ask, not guess)
1. Brand: logo, primary/secondary/accent colors, preferred fonts (Step 10). If none, agent proposes two options.
2. Names for receptionist, department staff and manager (placeholders are used until given).
3. Real company facts for AI knowledge: services, departments, contact details (Step 14).
4. AI provider and hosting for the backend (Step 14).
5. Where 3D models, characters and animations come from, with licences (Step 11).
6. Reference desktop (CPU/GPU/browser) for FPS targets (Step 12).
7. Production domain and hosting (Step 15).
8. Legal: privacy policy and terms need owner/legal input (Step 15).

## Honest limits
- Antigravity's own settings (where it stores rules, how it reads folders) were not verified when this pack was made. If it does not auto-read AGENTS.md, the START_HERE prompt makes it read the files explicitly.
- Realistic, luxurious 3D needs professional models and animations. Code alone gives blockout/placeholder visuals. Step 11 is the real bottleneck.
- No time or FPS guarantees. They depend on your assets and device and must be measured.
