# Production Checklist

## Product/content

-   [ ] Exact company branding approved.
-   [ ] Company facts in dialogue verified.
-   [ ] All assets have commercial-use/licence records.
-   [ ] No fake claims, staff credentials or placeholders presented as
    real.
-   [ ] Guided and free paths tested.

## Engineering/security

-   [ ] Lint, typecheck, tests and production build pass.
-   [ ] Required asset failures recover safely.
-   [ ] Route cancellation/camera transitions stable.
-   [ ] AI timeout, schema validation, rate limits and fallback tested
    if enabled.
-   [ ] No client-side secrets.
-   [ ] CORS/origins and HTTPS verified.
-   [ ] No unhandled errors in primary journey.
-   [ ] Resources/listeners disposed correctly.

## UX/performance

-   [ ] Desktop reference device/browser tested and FPS recorded.
-   [ ] Loading/progress/error UI works.
-   [ ] Keyboard focus and controls tested.
-   [ ] Reduced-motion and audio controls work.
-   [ ] Mobile status accurately labelled.

## Operations

-   [ ] Production environment variables configured.
-   [ ] README/setup/deployment updated.
-   [ ] Rollback plan exists.
-   [ ] Release notes and known limitations published.
