# Design system - Phase 4 (editorial monochrome)

## Direction
Near-black neutral surfaces, off-white type, ONE blue accent. No purple/fuchsia gradients, no orb, no background grid. Large typography does the work; motion is the existing `Reveal`/`Magnetic` system (respects `prefers-reduced-motion`).

## Tokens (`tailwind.config.ts`)
| Token | Value | Use |
|---|---|---|
| bg / panel / panel2 | #0a0a0b / #111113 / #17171a | page and surfaces |
| ink / muted | #f5f5f2 / #a1a1a6 | text |
| purple (legacy name) | #6f93ff | accent for TEXT and small marks on dark. Do not put white text on it (fails contrast) |
| violet (legacy name) | #3f66f5 | accent for BUTTON/solid backgrounds with white text (5.0:1) |
| pink (legacy name) | #a9bfff | light accent tint |
Token names were kept (`purple`, `violet`, `pink`) so existing classes keep working; rename later in a dedicated refactor.

## Hero (`components/Hero.tsx`)
- Content from `data/profile.ts`; claims limited to what the code supports (full-stack, React/Next.js/Node.js, REST, JWT, RBAC).
- Optional portrait: put your own photo at `public/images/abhishek.webp` (or .jpg/.jpeg/.png). It appears automatically at 4:5. `grayscale contrast-110` is display styling only; delete those classes in `Hero.tsx` for full colour. The image is never edited, regenerated or beautified by the site.
- With no photo file, no portrait slot renders.

## Contrast rules applied
White text only on `bg-violet` or the #3f66f5 -> #2d52dc button gradient. Cookie notice is a single compact line when analytics are disabled.
