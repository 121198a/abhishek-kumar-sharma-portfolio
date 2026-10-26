# Emberdoor — Log in / Sign up / Forgot password (React)

A React + Vite port of the original static Emberdoor demo.

```bash
npm install      # required once, before anything else
npm run dev      # http://localhost:5173
npm run build    # production build (with pre-rendered HTML) in dist/
npm run preview  # serve the production build
npm test         # Vitest + Testing Library
```

## Features
Log in, sign up (strength meter, confirm password, terms), forgot-password state, Google / LinkedIn / GitHub
buttons (loading + error states), a "runaway" submit button while the form is invalid, and a door-opening
creature scene on a valid submit. Keyboard accessible; `prefers-reduced-motion` is respected (the button stops
running, effects are shortened).

## IMPORTANT: this is a frontend demo
`src/lib/auth.js` fakes network calls. Nothing is verified and no passwords are stored (only the email, if
"Remember me" is ticked, plus unsent name/email drafts for sign-up and reset, cleared on success;
passwords are never stored). Client-side validation is not security.

## Saved drafts and layout
- **Draft persistence:** sign-up name/email and password-reset email use namespaced, versioned `localStorage` keys (`emberdoor:v1:draft:signup` and `emberdoor:v1:draft:forgot`). Drafts restore on reload, are cleared after successful submission, and expire after 7 days (`purgeExpiredDrafts()` runs at startup in `src/main.jsx`; an inline draft bridge in `index.html` also refills/saves the pre-rendered fields before React loads). Malformed or inaccessible storage is handled without blocking the form. Passwords, password confirmations, and terms acceptance are never persisted. The login email is stored only when the user explicitly enables “Remember me” (`emberdoor:v1:login:remembered-email`). Helpers: `src/lib/storage.js` and `src/hooks/useFormFields.js`.
- **No page scroll:** on windows at least 901 x 520 px the page fits the viewport. Smaller windows, phones and
  zoomed-in views scroll normally so nothing is cut off (`Fit-to-window` block at the end of `src/styles/style.css`).

## Semantics and SEO
- **Landmarks:** `header` (brand), `main`, `aside` (hero), and one `section` per screen. Exactly one `h1`: the visible
  screen's heading is the `h1`, hidden screens use `h2`. Every image has a descriptive `alt`.
- **Pre-rendering:** `npm run build` renders the login screen into `dist/index.html` (`scripts/prerender.mjs`), and
  `npm run dev` does the same via a small plugin in `vite.config.js`, so crawlers and scanners that don't run
  JavaScript still see real content. React replaces it when the script loads.
- **Deployment-specific SEO:** set a canonical URL and matching `og:url` / `og:image` only after the production domain and share image are known. Decide whether this authentication page should be indexed before deployment; absent a robots directive, search engines apply their defaults.

## Design tokens (consistency)
- **Radii** (`theme.css`): `--r-xs` 4px, `--r-sm` 12px, `--r-lg` 24px, `--r-pill` 999px, `--r-arch` (door shape). Use these, not raw values.
- **Buttons:** five styles only: `.go` (primary), `.cta` (secondary pill, also the scene's "Close the door"), `.soc`, `.eye`, `.link`.
- **Contrast:** the primary button uses `--a-deep` / `--b-deep` so white text stays at 4.5:1 or better (worst case ~4.9:1 on hover).
  Hero text sits on a gradient, so automated checkers (axe) can only mark it "needs review"; measured pixel contrast is 8.0:1 or better.
- **Door scene:** `#scene` is a flex column. The door width `--w` is capped by the window height so the door, the creature
  walking out, the message and the button never overlap or leave the window. Page scroll is locked while it is open.

## Project layout
```
index.html                 title, meta description, Open Graph tags
public/favicon.svg
src/
  App.jsx                  view state (#hash), scene state
  components/              Hero, AuthView, LoginForm, SignupForm, ForgotForm, Field,
                           SubmitButton, SocialButtons, StrengthMeter, DoorScene, BackgroundCanvas
  hooks/                   useFormFields, useAuthSubmit, useRunaway
  lib/                     auth (adapter), validation, motion, providers (icon paths)
  styles/                  theme.css (edit this to restyle), style.css
  test/                    Vitest suite
```

## Customize
- Colors, sizes, fonts: `src/styles/theme.css`
- Mascot / logo: `src/assets/mascot.svg`, `src/assets/logo.svg`; favicon: `public/favicon.svg`
- Background motion: `src/components/BackgroundCanvas.jsx` (`COLORS`)
- Runaway behaviour: `src/hooks/useRunaway.js` (`RADIUS`, push strength 150 / 60)
- Alt text for the logo and mascot: `LOGO_ALT` / `MASCOT_ALT` in `src/components/Hero.jsx`

## Connect a real backend
Replace `login`, `signup`, `forgot` in `src/lib/auth.js` with `fetch` calls that throw on failure.

## OAuth
Create apps with Google, LinkedIn and GitHub, set redirect URLs, handle the code exchange on a server (never
put client secrets in frontend code), then make `AuthAdapter.oauth(provider)` redirect to your backend route.
Provider icons are simplified; check each provider's brand guidelines before production.

## Before you deploy
Build with your real address so canonical, `og:url`, `og:image` and JSON-LD `url` are absolute:
`SITE_URL=https://your-domain npm run build`. Without `SITE_URL` those tags are omitted (dev uses the dev-server origin).
The page is `index, follow`; switch `<meta name="robots">` in `index.html` to `noindex` if you do not want the sign-in page indexed.
