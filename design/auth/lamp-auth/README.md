# LuminaVault auth page (React + Vite + Tailwind)

Split-screen login and signup page: hero and dimmable chandelier on one side, glass form card on the other. Stacks to one column below the `lg` breakpoint. Dark and light themes.

## Run
```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
```

## Structure
- `src/content.js` all visible copy
- `src/services/auth.js` **demo stub, replace with your real API** (see comment inside)
- `src/hooks/useAuthForm.js` form state, validation, submit flow
- `src/hooks/useTheme.js` dark/light, saved to localStorage
- `src/components/` TopBar, HeroPanel, Chandelier, AuthCard, Field, SocialIcons
- `src/lib/` password strength, Web Audio sounds
- `src/index.css` theme variables and shared Tailwind component classes

## Notes
- Authentication is NOT real until you implement `src/services/auth.js`.
- "Remember me" is passed to `authenticate()`; it has no effect until your backend uses it.
- "Forgot password?" shows a not-connected notice until you wire it.
- Google and Facebook buttons: demo sign-in by default; set `VITE_AUTH_BASE_URL` (see `.env.example`) to redirect to your backend OAuth routes. Details in `src/services/auth.js`.
- Sounds are off by mute button in the header; they only play after a user action.
