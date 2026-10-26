# USNAYA Motors: animated velocity studio navbar
React + Vite navbar (framer-motion + GSAP). Light/dark theme persists in localStorage; animation speed presets (Slow/Normal/Fast/Cinematic) persist too.
## Run
`npm install && npm run dev`  |  `npm run build && npm run preview`
## Notes
- Search/profile/favorites/CTA/dock are front-end demos (no backend); toasts say so.
- Reduced-motion preference overrides the speed preset.
- Velocity speed is a simulated demo value, not telemetry. The preset changes drawing speed only, never the numeric speed.
- Speedometer ramps 0 -> cruise on load, then cycles; hover the car or the gauge to rev toward max (arc/ring turn orange above 85%).
- Reduced-motion: scenery scroll/clouds/entrance are paused and swaps are instant; needle, wheels and hover feedback stay. Settings (gear) has an "Animate anyway" opt-in.
- Suggested production headers (set at host, not in code): Content-Security-Policy `default-src 'self'; script-src 'self' 'sha256-<hash of the inline theme script>'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; object-src 'none'; base-uri 'self'; frame-ancestors 'none'`, plus X-Content-Type-Options: nosniff and Referrer-Policy. Untested against a real deploy.
