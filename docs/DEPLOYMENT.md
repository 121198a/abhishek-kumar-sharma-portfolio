# Deployment guide (Vercel, free tier)

Nothing is purchased automatically. Everything below works on the free `*.vercel.app` address; a custom domain is optional.

## 0. Before the first deploy
1. **Rotate the NVIDIA API key.** The ZIP originally shared for this project contained a live-looking key in `.env.local`. Create a new key at build.nvidia.com and revoke the old one.
2. Generate a session secret: `openssl rand -hex 32`.
3. **Change the MySQL root password** hardcoded in the `FIR_Management_System` repository, and stop committing credentials there.
4. Decide whether `public/resume.pdf` should keep your phone number (it is public).
5. Confirm facts that are still unverified on the site and in the chatbot: Spring Boot, .NET, AWS S3/Lambda, the steganography paper details, the Infopulse role, project years. Then run `npm run index:knowledge` to rebuild the chatbot embeddings.

## 0b. Dependency check (do this before EVERY deploy)
Run `npm ci && npm audit --omit=dev`. It must report 0 vulnerabilities. In October 2026 the project had to move from Next.js 15.5.21 to 15.5.27 because of two critical remote-code-execution advisories (details in SECURITY_NOTES.md). Keep `next` on the newest 15.5.x patch (or a supported newer release) and re-check regularly.

## 1. Deploy
1. Push the project to a GitHub repository (do **not** commit `.env.local`; it is git-ignored).
2. vercel.com > Add New > Project > import the repo. Framework preset: Next.js (auto). Build command `next build`, no changes needed.
3. Add the environment variables below (Project > Settings > Environment Variables) for Production (and Preview if you want previews to work).
4. Deploy, then open the URL.

## 2. Environment variables
Never prefix a secret with `NEXT_PUBLIC_` - that exposes it to the browser.

| Variable | Required? | Purpose / default |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | **Yes** | Your real public URL (no trailing slash). Used for canonical URLs, sitemap, Open Graph. The default is a placeholder that may not be yours. |
| `CHAT_SESSION_SECRET` | **Yes** | Signs the chat session-count cookie. Without it a random per-instance secret is used and the count resets on cold starts. |
| `NVIDIA_API_KEY` | For the AI model | Server-only. Without it the assistant answers from local data only. |
| `NVIDIA_BASE_URL`, `NVIDIA_MODEL`, `NVIDIA_EMBEDDING_MODEL` | Optional | Provider endpoint/model names. |
| `ENABLE_AI`, `ENABLE_RAG`, `ENABLE_CONTACT_FORM`, `ENABLE_ANALYTICS` | Optional | Feature flags. Analytics default off. |
| `AI_DAILY_LIMIT` (20), `AI_MAX_MESSAGES_PER_SESSION` (10), `AI_RATE_LIMIT_PER_IP_PER_MINUTE` (5), `AI_MAX_INPUT_CHARS` (400), `AI_MAX_OUTPUT_TOKENS` (512), `AI_REQUEST_TIMEOUT_MS` (15000) | Optional | Cost guards (defaults in parentheses). The chat route sets `maxDuration = 30` s, so keep embedding + model timeouts under that. |
| `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL` | For the contact form | All three needed or the form answers 503 with a "use the email link" message. Check Resend's docs for which sender address works before you own a verified domain. |
| `CONTACT_RATE_LIMIT_PER_IP_PER_HOUR` (3), `ANALYTICS_RATE_LIMIT_PER_IP_PER_MINUTE` | Optional | Abuse guards. |
| `GITHUB_TOKEN` | Recommended | Read-only fine-grained token, public repos, no permissions. Avoids rate limits on shared build IPs. |

## 3. After the first deploy
- Open DevTools > Console on the live site. If the full CSP (shipped as `Content-Security-Policy-Report-Only` in `next.config.mjs`) logs no violations, rename it to `Content-Security-Policy` to enforce it.
- Run https://pagespeed.web.dev on the live URL, 3-5 times, mobile, and use the median. Lab scores in this project's sandbox were noisy (see PERFORMANCE_A11Y.md).
- Test the chat, the contact form, `/sitemap.xml`, `/robots.txt`, and a link preview of the site (the Open Graph image is generated at `/opengraph-image`).
- Submit the sitemap in Google Search Console and Bing Webmaster Tools.
- Optional: add `public/images/abhishek.webp` (your own photo) and redeploy; the hero shows it automatically.

## 4. Rollback
Vercel keeps previous deployments: Project > Deployments > pick an earlier one > Promote to Production (or Instant Rollback).

## 5. Domain name ideas (availability NOT checked; verify with a registrar)
Short and professional, based on your name: `abhisheksharma.dev`, `abhishekkumarsharma.dev`, `aksharma.dev`, `abhishekks.dev`, `abhishek-sharma.dev`, `abhisheksharma.me`, `abhisheksharma.in`. Prefer a `.dev` or `.me` over gimmicky TLDs. Do not buy anything until you have confirmed availability and the renewal price (first-year prices are often lower than renewal).

## Known deployment risks
- The IP/daily AI counters are in-memory per instance (soft limits).
- NVIDIA's free endpoint is a trial-style service; the site degrades to local answers if it fails.
- `maxDuration` above 10 s relies on Hobby's configurable limit; if Vercel changes that, lower `AI_REQUEST_TIMEOUT_MS` so the fallback path still finishes in time.
