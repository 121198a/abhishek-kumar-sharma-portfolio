# Cost and free-tier limits

Checked 2026-10-03 against the sources named below. **Limits and terms change - re-check each source before relying on a number.** "Unofficial" means the figure came from a third-party page, not the provider.

| Service | Used for | Free? | Limits found | Source | If the quota is exceeded | Replaceable by |
|---|---|---|---|---|---|---|
| **Vercel Hobby** | Hosting, serverless API routes, ISR | Yes | Free plan for personal, non-commercial use only. Exceeding a usage limit generally means waiting until 30 days pass before the feature is usable again. Function duration: 10 s default, configurable up to 60 s on Hobby. | vercel.com/docs/plans/hobby, /docs/limits/fair-use-guidelines | The affected feature stops until the window resets (no surprise bill on Hobby). | Cloudflare Pages/Workers or Netlify (free tiers not evaluated here). GitHub Pages is static-only, so the chat and contact API routes would be lost. |
| **GitHub REST API** | "Code on GitHub" section | Yes | 60 requests/hour unauthenticated; 5,000/hour with a token. This site makes at most 1 request per day per deployment. | docs.github.com (rate limits) | Section shows the committed snapshot and says so. | The snapshot file alone (no API). |
| **Resend** | Contact-form email | Yes | Free: 3,000 emails/month, 100/day, 1 domain; no overage on free (sending pauses). The site also limits each IP to 3 submissions/hour. | resend.com/pricing, resend.com/docs | Form returns a clear 502 telling visitors to use the email link instead. | Any SMTP/email API with a free tier; or remove the form and keep a mailto link. |
| **NVIDIA NIM (build.nvidia.com)** | AI assistant model + embeddings | Free hosted API key, no card reported | Roughly 40 requests/minute per model (**unofficial**: third-party docs/blog posts; the dashboard shows your real limit). Described as intended for prototyping/trial, so terms may change. The site's own caps: 5 requests/IP/min, 10 messages/session, 20 AI answers/day. | Third-party sources only - confirm on build.nvidia.com | Chat falls back to local grounded answers (verified by the smoke test "deterministic fallback"). Set `ENABLE_AI=false` to turn the model off entirely. | Any other free LLM API, or local-answers-only mode. |
| **Custom domain** | Optional | **No** | Domain registration is paid and prices vary by registrar/TLD (not checked here). | - | - | The free `*.vercel.app` address. |
| Analytics | Page/event counts | Off by default | `ENABLE_ANALYTICS=false` unless you opt in. | - | - | - |

## Two things to decide before going live
1. **Hobby is non-commercial.** Vercel defines commercial use as any deployment used for anyone's financial gain, including a paid employee writing the code. A portfolio for job hunting is the usual intended use, but if you use the site to sell freelance services, confirm with Vercel support or host elsewhere.
2. **The AI assistant depends on a free trial-style API.** The site is built to keep working without it (local fallback), so an outage or policy change degrades the chat, not the site.

## Code-level cost guards already in the project
Per-IP and per-session limits, a daily AI-answer budget, input/output length caps and a request timeout, all configurable by env var (see DEPLOYMENT.md). The IP and daily counters live in memory per serverless instance, so they are a soft guard, not a hard budget. A shared store (for example a free-tier Redis) would make them global; not adopted to avoid another service.
