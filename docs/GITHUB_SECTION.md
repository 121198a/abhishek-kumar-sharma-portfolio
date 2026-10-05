# "Code on GitHub" section - Phase 9

## How it works
`components/GitHubActivity.tsx` is a **server component**. It calls `lib/github.ts`, which fetches `https://api.github.com/users/121198a/repos` on the server, cached for 24 h (ISR - the page stays static). The browser never contacts GitHub and never sees a token (verified: 0 browser requests to api.github.com).

- Forks, private repos, the profile README repo and malformed rows are dropped (`normalizeRepos`).
- The 6 most recently pushed repos are shown, plus the repo count and a language bar (repos per primary language - repos with no detected code are omitted, and the label says so).
- **If the API fails** (rate limit, outage, offline build, bad payload) the committed snapshot in `data/github-snapshot.ts` is used and the page says "Snapshot from <date> - live GitHub data was unavailable". It never throws.

## Cost
Free. Unauthenticated GitHub API: 60 requests/hour per IP; this makes at most one request per day per deployment. Shared build IPs can be rate limited, so set an optional read-only `GITHUB_TOKEN` (fine-grained token, public repos, **no permissions**) in Vercel env vars. Never prefix it with `NEXT_PUBLIC_`. Re-check GitHub's current rate limits before relying on these numbers.

## Tests
`npm run test:github` - 8 checks: payload normalisation and sorting, private/fork/profile filtering, rate-limit-message payload, language counts, snapshot sanity, and three fetch paths (network failure -> snapshot, HTTP 403 -> snapshot, valid response -> live).

## Things to know
- **Repo descriptions are shown exactly as written on GitHub.** Some contain claims this audit could not confirm (for example "20+ backend modules" on unboundx-admin-dashboard; the audit found 16 routes). Edit them on GitHub if they are not accurate.
- Repos whose code was never pushed (steganography, STM32 ramp, e-commerce back end, campus-connect) will appear in "View profile" but are not in the top 6. Push the code or the READMEs become the only thing a visitor sees there.
- Refresh the snapshot occasionally (edit `data/github-snapshot.ts`) so the fallback does not go stale.
