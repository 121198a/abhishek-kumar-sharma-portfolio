# Cost Control

Target: **₹0–₹300/year for infrastructure**, free tier first, no surprise billing.

Prices and quotas below are what each provider offered at the time this was
written — always check the provider's current pricing page before relying on
a number here, since free tiers change over time.

## Services in use

| Service | Tier | What it's for | Behavior at the limit |
|---|---|---|---|
| Vercel Hobby | Free | Hosting, CDN, serverless functions | Deploys/builds throttle; site stays up, new deploys may need to wait |
| NVIDIA NIM | Free tier | AI portfolio assistant | `ENABLE_AI` auto-flips off for the rest of the day; visitors get the local FAQ fallback instead of an error |
| Resend | Free (3,000/mo, 100/day at time of writing) | Contact form delivery | Route returns a clear error asking the visitor to email directly instead |
| Supabase | Free (not yet enabled) | Optional future persistence (contact log, recruiter analytics) | N/A — portfolio works with zero database rows |
| Same-origin `/api/analytics` | Free (self-hosted, no third party) | Optional, consent-gated event logging | Disabled by default via `ENABLE_ANALYTICS=false` |

No paid service (Vercel Pro, a hosted database, paid email, paid analytics,
paid monitoring, a CDN, a paid AI plan, a VPS, EC2, RDS, Kubernetes, Redis,
Docker hosting, or paid CI runners) is required for this site to run.

## Guardrails enforced in code

- **Per-IP rate limits** — chat (`AI_RATE_LIMIT_PER_IP_PER_MINUTE`) and
  contact (`CONTACT_RATE_LIMIT_PER_IP_PER_HOUR`), enforced in
  `lib/rate-limit.ts`.
- **Global daily AI budget** — `AI_DAILY_LIMIT` requests/day across all
  visitors. Once hit, AI auto-disables until UTC midnight; the rest of the
  site keeps working.
- **Per-session message cap** — `AI_MAX_MESSAGES_PER_SESSION`, enforced
  client + server side.
- **Input/output caps** — `AI_MAX_INPUT_CHARS`, `AI_MAX_OUTPUT_TOKENS`,
  `AI_REQUEST_TIMEOUT_MS` bound every model call.
- **Spam/honeypot checks** on the contact form — no paid captcha needed.

## What happens if a free quota is exhausted

```
Service limit hit
      ↓
Route catches the error / checks the budget counter
      ↓
Logs a safe, non-sensitive message
      ↓
Falls back (local FAQ answer, or a clear "try again" message)
      ↓
Rest of the site continues working
```

The site never depends on a single external API to render or navigate.

## Emergency disable switches

Set any of these in the Vercel project's environment variables and redeploy
(or use a preview override) to instantly turn a feature off:

```
ENABLE_AI=false
ENABLE_ANALYTICS=false
ENABLE_CONTACT_FORM=false
```

## Upgrade conditions

Only consider a paid tier when there is a **demonstrated** need, e.g.:

- Real recruiter traffic consistently exceeds the NVIDIA or Resend free
  quota for multiple days in a row.
- Vercel Hobby build/bandwidth limits are actually being hit (check the
  Vercel dashboard, don't guess).

Never auto-upgrade or enable pay-as-you-go billing — any paid tier is a
manual, deliberate decision.

## Adding Supabase later

Nothing here requires a rewrite to add Supabase:

- Contact submissions: log each accepted message to a `contact_submissions`
  table from `app/api/contact/route.ts`.
- Recruiter analytics: swap the `console.info` in
  `app/api/analytics/route.ts` for a Supabase insert.
- Rate limiting: replace the in-memory `Map` in `lib/rate-limit.ts` with a
  Supabase-backed counter if you need limits to hold across serverless
  instances.
