# Security notes — Phase 2

## Changed
- **Chat session cap is now server-enforced** (`lib/session-cap.ts`): a signed, HttpOnly, 1-hour cookie holds the message count. The server uses the larger of the client hint and the verified cookie, so a client can no longer reset the cap by sending `sessionMessageCount: 0`. Forged or expired cookies count as 0.
- **Security headers**: `frame-ancestors`, `object-src`, `base-uri` and `form-action` are now enforced. A full CSP ships as `Content-Security-Policy-Report-Only` - check DevTools > Console on the deployed site; if there are no violations, rename it to `Content-Security-Policy` in `next.config.mjs`.
- **Social preview image** generated at build time (`app/opengraph-image.tsx`), no asset needed.

## Still true (not fixed)
- Clearing cookies resets the per-session count. The real cost backstops are the per-IP limit and the daily AI budget, both in-memory and per serverless instance. A shared store (e.g. a free-tier Redis) would make them global; check current free-tier limits before adopting.
- `public/resume.pdf` is publicly served and contains a phone number.

## Before deploying
1. Rotate the NVIDIA key that was inside the originally uploaded ZIP.
2. Set `CHAT_SESSION_SECRET` (`openssl rand -hex 32`) in Vercel env vars.
3. Run `npm run index:knowledge` with a fresh key to rebuild embeddings for the updated project data.
4. Change the MySQL root password hardcoded in the FIR_Management_System repo.

---

# Phase 13 - security testing and hardening (2026-10-04)

## Dependency vulnerabilities (the most important finding)
`npm audit` flagged the pinned **Next.js 15.5.21** with two **critical, unauthenticated remote-code-execution** advisories published with Vercel's 2026-08-25 security release:
- **GHSA-2xp9-vwfh-vxw4** - heap buffer overflow in libheif (via `sharp`) reachable through the image optimiser when **AVIF** optimisation is enabled. This project's `next.config.mjs` enabled AVIF.
- **GHSA-p293-qw3h-jr36 / CVE-2026-75604** - path traversal on servers using a **Windows filesystem** (so also relevant to `next dev` / `next start` on a Windows laptop).
Patched in 15.5.24; the newest release in the 15.5 line is 15.5.27, which is now installed (patch-level upgrade, no code changes needed). Also:
- A leftover `overrides` entry forced `sharp` to 0.35.3 (below the fixed 0.35.4). Removed; `sharp` is now 0.35.5.
- **AVIF removed from `images.formats`.** The patched Next releases switch AVIF off anyway; this makes it explicit. Verified: a browser sending `Accept: image/avif,...` receives WebP.
- `npm audit --omit=dev` now reports **0 vulnerabilities**. `npm audit` (all) still lists 7 *high* advisories in **dev-only** tooling (glob/brace/yaml parsers inside eslint and Tailwind 3). They cannot be reached by visitors; fixing them needs major upgrades (Tailwind 4, a different eslint-config-next) that were out of scope. Re-run `npm audit` before every deploy: new advisories appear continuously.

## API hardening (`lib/request-guard.ts`, used by /api/chat and /api/contact)
`tests/security.ts` (68 checks) first found 9 real failures, all now fixed:
| Failure | Fix |
|---|---|
| JSON body `null` crashed chat and contact with HTTP 500 | body must be a JSON object, else 400 |
| `Content-Type: text/plain` accepted (lets a cross-site HTML form reach the API without a CORS preflight) | 415 unless `application/json` |
| Cross-origin `Origin` header accepted | 403 unless Origin host equals the request host |
| Size cap trusted `Content-Length`; chunked uploads bypassed it | body streamed with a hard byte cap, 413 |
| `X-Powered-By` header exposed the framework | `poweredByHeader: false` |
Also: JSON-LD is serialised with `<` escaped (`lib/json-ld.ts`); `getClientIp` prefers Vercel's `x-vercel-forwarded-for`.

## What the test suite checks (run: build, start, then `BASE_URL=http://localhost:3000 npm run test:security`)
Method handling; 7 malformed JSON shapes on each route; wrong content type; cross-origin; oversize bodies with and without Content-Length; honeypot; CRLF/header-injection attempts in name and email; wrong field types; poisoned history/mode/project fields; absurd `sessionMessageCount` values; contact rate limit (429); three prompt-injection strings (no secret or system text in replies); security headers on pages and APIs; session cookie flags; internal files (`.env.local`, `.git`, `package.json`, `next.config.mjs`, `lib/`, embeddings, tests) not reachable over HTTP; no stack traces on 404; no secret-looking strings in any response.

## Already sound (verified in code)
Chat output is rendered as React text (no markdown/HTML injection); the contact email is plain text; control characters are stripped; the analytics route uses strict allow-lists and is off by default; secrets are read server-side only and none are `NEXT_PUBLIC_`.

## Not covered / residual risk - be honest with yourself about these
- **Prompt injection against the live AI model is NOT tested.** The sandbox cannot reach NVIDIA. The suite only proves the deterministic layers (validation, limits, no secret leakage in fallback replies). Resistance of the model itself depends on the system prompt, grounding and the provider's model; test it manually with the real key before launch.
- **Per-IP limits trust a forwarded-IP header.** On Vercel that is safe (Vercel's docs say it overwrites `X-Forwarded-For` and does not forward external IPs, to prevent spoofing). On any other host it can be spoofed, which would bypass the per-IP limits; the per-session cookie and the daily AI budget remain.
- Rate-limit and daily-budget counters are in memory per serverless instance (soft limits).
- No penetration test, no WAF, no load/DoS testing, no check of Vercel's own configuration.
- The full CSP is still `Report-Only` until you verify it in a browser on the live site.
