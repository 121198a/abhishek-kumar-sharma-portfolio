# Design Brief — Portfolio v2 Premium System

**Target:** Abhishek Kumar Sharma Portfolio  
**Philosophy:** Distinctive, editorial, restrained, and engineered. Not AI-generated, not template-based, not vibe-coded.  
**Prime Directive:** Zero regression of existing features, routes, APIs, or mobile responsive behavior.

---

## 1. Visual Identity & Concept

The portfolio presents Abhishek as a **Full-Stack AI Developer** with real production and research experience. 
The redesign moves away from generic "AI-generated" tropes:
- **No excessive floating neon glow orbs** (`hero-ambient` blurred radial circles).
- **No muddy cream/yellow light theme** (`#f5f3ee` replaced by crisp, luminous architectural slate-white `#f8f9fa`).
- **No pitch-black void dark theme** (`#070b12` replaced by layered graphite-slate `#0b0f17` with calibrated surface elevation).
- **No harsh 3-color rainbow gradient text** (replaced by subtle, refined metallic/indigo depth).
- **Intentional typography and structural hierarchy**: Clean hairline borders, subtle tonal surfaces, confident typographic scale, and purposeful whitespace.

---

## 2. Typography & Scale

- **Typeface:** Inter (`next/font/google` self-hosted variable font) across all headings and body copy.
- **Monospace Stack:** `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace` for technical stats, dates, tags, and code badges.
- **Scale:**
  - Hero Display: `clamp(2.5rem, 5.5vw, 4.25rem)` with leading `0.95` and letter-spacing `-0.04em`.
  - Section Headings (H2): `clamp(1.75rem, 3.5vw, 2.75rem)` with leading `1.05` and letter-spacing `-0.03em`.
  - Card / Subsection Headings (H3): `1.125rem` to `1.25rem` (18px–20px) bold.
  - Body Copy: `0.9375rem` (15px) and `1rem` (16px) with leading `1.65` for optimal readability.
  - Meta / Badges / Labels: `0.75rem` to `0.8125rem` (12px–13px) font-medium or font-semibold.

---

## 3. Layered Color & Elevation Tokens (Light & Dark)

| Token | Light Mode (Refined Slate-White) | Dark Mode (Layered Graphite) | Purpose |
|---|---|---|---|
| `--bg` / `--background` | `#f8f9fa` | `#0b0f17` | Base canvas background |
| `--surface` / `--panel` | `#ffffff` | `#111722` | Cards, dropdowns, input backgrounds |
| `--surface-strong` / `--panel2`| `#f1f3f6` | `#171f2d` | Raised containers, dialogs, pill backgrounds |
| `--ink` / `--foreground` | `#0f172a` (Slate 900) | `#f1f5f9` (Slate 100) | Primary high-contrast text (>14:1) |
| `--muted` | `#475569` (Slate 600) | `#94a3b8` (Slate 400) | Secondary body copy and labels (>4.5:1 AA) |
| `--border` / `--line` | `rgba(15, 23, 42, 0.08)` | `rgba(148, 163, 184, 0.12)` | Subtle, crisp structural borders |
| `--accent` | `#3b82f6` (Indigo/Blue) | `#60a5fa` (Technical Blue) | Focus rings, active states, key icons |
| `--purple` | `#4f46e5` (Indigo) | `#818cf8` (Soft Indigo) | Brand identity accent |
| `--button-start` / `end` | `#312e81` → `#4f46e5` | `#2563eb` → `#4f46e5` | Primary CTA button gradient |

---

## 4. Motion Principles

- **Kinetic Typography:** Kept in the Hero as the signature opening moment, with strict accessibility (`aria-label` on heading, `aria-hidden` on kinetic character spans).
- **Hardware-Accelerated Transitions:** Animating `transform` and `opacity` only; no reflow or layout thrashing.
- **Lenis Smooth Scroll:** Calibrated at `1.0s` duration with custom easing `(t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))`. Fully disabled when `prefers-reduced-motion` is active.
- **Intersection Observer Reveals:** Single unified observer using CSS transitions, not heavy JS timers.

---

## 5. Section-by-Section Plan

1. **Header / Navigation (`Nav.tsx`)**:
   - Clean glassmorphism with subtle hairline border; clear active section pill; theme toggle + motion toggle; smooth drawer on mobile.
2. **Hero (`Hero.tsx`)**:
   - Clean background video integration with accessible overlay; refined kinetic title; verified stats bar (`Building since 2021`, `9 Projects documented`, etc.).
3. **Marquee (`InfiniteTextMarquee.tsx`)**:
   - Elegant technical ticker with refined tracking and subtle border dividers.
4. **About (`About.tsx`)**:
   - Asymmetric two-column editorial layout: narrative bio and direct links on the left; structured role card (`Frontend Developer Intern @ Infopulse`) on the right; clean 3-column engineering approach grid below.
5. **Experience (`Experience.tsx`)**:
   - Vertical timeline with glowing status node on active role; clear date badges and structured role outcomes.
6. **Projects (`Projects.tsx`)**:
   - Desktop: Multi-column grid with Live Project external link and Code link on each card.
   - Mobile: Interactive card slider with swipe gestures, touch drag, and sticky focused detail view.
7. **Designs (`Designs.tsx`)**:
   - Clean visual design case studies layout with the reusable card slider system.
8. **Skills (`Skills.tsx`)**:
   - Categorized technical competencies with authentic Simple-Icons and Lucide icons; subtle borders and clean hover elevation.
9. **Education (`Education.tsx`)**:
   - Desktop: Numbered timeline milestones (`01`, `02`, `03`) with CGPA/Percentage badges and verified coursework tags.
   - Mobile: Touch-swipeable milestone slider with sticky detail view.
10. **AI Intro & Assistant (`AIIntro.tsx`, `AIChat.tsx`)**:
    - High-contrast dialog with clear recruiter/general modes, natural response formatting (zero asterisks/brackets), and accessible chat controls.
11. **Contact (`Contact.tsx`)**:
    - Centered, balanced layout matching Screenshot 1 reference; searchable country flag calling code selector (`[ 🇮🇳 +91 ▼ ]`); direct email and phone contact cards.
12. **Footer (`Footer.tsx`)**:
    - Clean technical footer with quick navigation, direct contact links, and back-to-top button.
