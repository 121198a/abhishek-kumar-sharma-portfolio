# Launch Readiness Checklist

Adapted from the owner's "20 things to protect" list. Each item is marked for THIS product. Report every item as Done / Not applicable / Needs owner input. Applicability may change if a backend/database is added.

## A. Technical protection
| # | Check | Applies here? |
|---|---|---|
| 1 | Rate limiting | Yes, on the AI endpoint (per IP/session) |
| 2 | API limits (message length, body size, tokens) | Yes |
| 3 | Spending caps | Yes: provider-side cap plus app-level daily request cap |
| 4 | Error handling | Yes: error boundary, asset, route, AI errors |
| 5 | Loading states | Yes |
| 6 | Empty states | Yes where lists can be empty |
| 7 | Failed-request handling with Retry | Yes (AI, assets) |
| 8 | API timeouts | Yes |
| 9 | Duplicate-submission prevention | Yes: chat send, knock, destination clicks |
| 10 | Duplicate payments | Not applicable (no payments) |
| 11 | Database query optimization | Not applicable unless a DB is added |
| 12 | Database indexes | Not applicable unless a DB is added |
| 13 | Pagination | Not applicable unless lists grow |
| 14 | Compress files and assets (GLB, textures, audio) | Yes, critical |
| 15 | Upload size limits | Not applicable unless uploads are added |
| 16 | Cache repeat requests (static assets, headers) | Yes |
| 17 | Uptime monitoring | Yes for the frontend and AI endpoint |
| 18 | Error logging (no secrets, no full private chats) | Yes |
| 19 | Test simultaneous users on the API | Yes if AI backend is live |
| 20 | Test backup restoration | Only if persistence exists |

## B. Product and site checks
Custom 404 page; clear primary action above the fold on the start screen; meta title and description on each page; Open Graph image; full favicon set; robots.txt; sitemap.xml; alt text on meaningful images; mobile breakpoints (after the mobile step); loading and form error/success states; Privacy Policy and Terms (owner/legal input required, this agent is not a lawyer); cookie consent only if non-essential cookies/analytics are used; analytics only with owner approval; real contact information (owner supplies); compressed images; canonical URLs; security headers (CSP compatible with WebGL, workers and the chosen CDN); internal links; HTTPS; **never expose environment secrets**.

## C. Final launch tests
- Browsers: Chrome, Edge, Safari, Firefox (record versions actually tested).
- Speed on fast and slow connections; record load size and FPS on the named reference device.
- Chat/forms: success, validation, loading, timeout, server-error states.
- Accessibility: keyboard navigation, visible focus, labels, contrast, reduced motion, no-WebGL fallback.
- Also see docs/blueprint/14_PRODUCTION_CHECKLIST.md.
