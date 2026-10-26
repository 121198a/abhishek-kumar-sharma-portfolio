# Design Guardrails (avoid the "vibe-coded" look)

Heuristics from the owner's "30 reasons a site looks vibe-coded" list. They are guidance, not laws: break one only on purpose and say why.

## Color and surfaces
- One controlled palette: one primary, one secondary, one accent, plus neutrals. No rainbow, no neon, no purple+black default, no generic pastel blocks.
- No harsh multi-color gradients, no glowing radial orbs, no dot-grid backgrounds.
- Not pure white everywhere: use tonal surfaces, texture, imagery, spacing.
- Shadows only for real elevation. Prefer borders, spacing and contrast.
- Glass/blur only where it communicates hierarchy (e.g. one overlay), never on every panel.

## Typography and copy
- Pick a display font + a text font on purpose. Not Inter / Geist / Space Grotesk by default. Include fallbacks.
- Avoid formulaic copy ("It's not X, it's Y") and overusing em dashes. Be specific.
- Never invent testimonials, clients or claims.

## Layout and components
- No "three identical feature cards" by default; no bento grids unless the content needs it.
- Do not use Lucide (or any one icon set) for everything; use a deliberate icon style or text labels. No emoji or sparkle icons as design elements.
- No colored left-stripe cards, no checkmark bullets everywhere, no fake terminal windows.
- Vary corner radii by role instead of one big radius everywhere.
- Show the real product (the 3D world, real dialogue), not marketing filler.

## Motion
- Animation must communicate state or hierarchy. No hover animation on everything, no endlessly moving arrows.
- Respect prefers-reduced-motion; offer an in-app toggle.

## Loading and polish
- Skeleton or progress states for everything async. No sudden empty-to-full jumps.
- Real terms and privacy pages before public launch (see docs/21).

## Review rule
At the end of every UI step, the agent lists which guardrails it checked and any it deliberately broke.
