# Security, Privacy and Accessibility Audit (Phase 11)

Scope: this repository as of the Phase 4-13 release. No claim of absolute security is made.

## Findings and state
| Area | Finding | State |
|---|---|---|
| Secrets | Provider key is read only in `server/index.ts` from `AI_PROVIDER_API_KEY`; no `VITE_` secret; `.env` is git-ignored; `.env.example` holds placeholders | OK |
| Input validation | `zod` schema: id patterns, message 1-300 chars; body limit 4 kB; bad JSON/oversize return a generic 4xx | OK (tested) |
| Output safety | Provider output re-validated (`sanitizeOutput`); navigate actions only for allow-listed destinations; React renders text (no `dangerouslySetInnerHTML`, `eval`, `window.open`, external links) | OK (tested) |
| Abuse limits | 20 requests/min per client, daily cap, 9 s provider timeout | OK (tested) |
| Logging | One JSON line per request: id, status, duration, outcome. No message text, IP or key | OK |
| Headers | API: `nosniff`, `X-Frame-Options`, `Referrer-Policy`, `no-store`, CORS allow-list. **Frontend: a Content-Security-Policy meta tag is now added to production builds** (`vite.config.ts`); verified the scene still renders under it with no violations | Fixed in this phase |
| Persistence/tracking | No database, cookies, analytics or chat storage. Only `localStorage` for volume/mute/quality/reduced-motion | OK |
| Dependencies | `npm audit` reports 0 vulnerabilities | OK at time of run |
| Third-party assets | None (see ASSETS_AND_LICENSES.md) | OK |
| Accessibility | Focus ring on all controls, ARIA roles/labels on panels and toolbars, `role="log"` transcript, `role="status"` voice notes, reduced-motion setting (defaults to the OS preference), text fallback for every spoken reply, touch controls | Checked in browser; screen-reader testing not done |

## Known limitations / residual risks
- CSP allows `style-src 'unsafe-inline'` (three/drei and React inline styles). `frame-ancestors` cannot be set from a meta tag; set it (and HSTS) at the host.
- The rate limiter and daily cap are in memory: they reset on restart and are per server instance.
- `trust proxy` is set to 1; this is right behind one reverse proxy and wrong otherwise.
- With `AI_PROVIDER=anthropic` the visitor's typed text is sent to that provider; the owner must approve this and publish a privacy notice. The default `local` provider sends nothing outside the server.
- A character id that matches the pattern but is unknown is accepted by the API (it only selects context). Low impact.
- No authentication exists or is needed for this public demo.
- Not tested: screen readers, high-contrast mode, load testing with many simultaneous users.
