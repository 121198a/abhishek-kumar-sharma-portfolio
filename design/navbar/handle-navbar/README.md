# Shaped Navbars

Three navigation bars whose silhouette matches the brand: a **bone** (dentistry), a **handlebar** (bike brand) and a **trail knife** (hiking & outdoor). Built with React 18 + Vite and plain CSS Modules.

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build
```

## Structure

```
src/
├── main.jsx
├── App.jsx / App.module.css        showcase page
├── data/navItems.js                labels, hrefs, icon keys (no markup)
├── hooks/useNavMenu.js             open/close, Escape, outside click, resize reset
├── icons/index.jsx                 decorative SVG icons + ICONS lookup
├── styles/global.css               reset, skip link, reduced motion
└── components/
    ├── NavLinks/                   semantic <ul><li><a> list, styled via `classes`
    ├── MenuToggle/                 accessible hamburger button
    ├── ShowcaseSection/            heading + badge wrapper for the demo
    ├── DentalNav/                  bone shape
    ├── BikeNav/                    handlebar shape
    └── HikingNav/                  knife shape (+ CarabinerIcon)
```

## Glass effect

- Each nav draws its glass on a `::before` layer (`backdrop-filter: blur() saturate()` plus a translucent tint), so the dropdown and shapes aren't clipped and no filter sits on an ancestor (which would break the blur).
- The bone's lobes are cut with a CSS `mask`; the knife's ridge uses `clip-path`. Shared blur lives in `--glass-blur` (`styles/global.css`); each nav owns its tint (`--glass-fill`).
- `prefers-reduced-transparency` and browsers without `backdrop-filter` get solid surfaces (`--glass-solid`).
- Glass needs something colourful behind it, so the demo wraps each nav in a "stage" (`ShowcaseSection`). On a plain background it will look flat.

## Bike handlebar parts (BikeNav, desktop)

Built from pseudo-elements, no extra markup: ribbed grips with lime lock rings, brake levers, a 4-bolt stem faceplate with the badge ring, a stem tube, and the glass bar tube.

## Design rules followed

- **No class soup**: one CSS Module per component, 1–2 meaningful class names per element, theme values as custom properties.
- **No div soup**: `nav > a, button, ul > li > a`. Shapes come from pseudo-elements and `clip-path`. The only wrapper div (BikeNav) exists so one `aria-controls` target covers two lists.
- **Accessibility**: `<nav aria-label>`, `aria-current="page"`, button with `aria-expanded` / `aria-controls`, Escape to close with focus restored, `:focus-visible` rings, 44px+ touch targets, decorative SVGs `aria-hidden`, skip link, `prefers-reduced-motion`, collapsed menus use `display: none` so they leave the tab order.
- **Responsive**: mobile-first; below 900px (`56.25em`) each bar shrinks to brand + toggle with a dropdown panel.
- Breakpoint lives in the CSS and in `useNavMenu.js` (`DESKTOP_QUERY`); keep them in sync.
