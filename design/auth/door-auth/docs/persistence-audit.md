# Form persistence audit

Reviewed the form controls in `src/components/` and the controlled state in `src/hooks/useFormFields.js`.

| Form / field | Persistence behavior | Reason |
| --- | --- | --- |
| Sign up: full name, email | `emberdoor:v1:draft:signup` | Non-secret draft fields; restored at initialization, removed after successful signup, expires after 7 days. |
| Sign up: password, confirmation | Excluded | Credentials must not be written to browser storage. |
| Sign up: terms acceptance | Excluded | Consent is intentionally asked again for each signup attempt; do not infer or retain legal consent from a draft. |
| Reset password: email | `emberdoor:v1:draft:forgot` | Non-secret form draft; removed after successful reset request and expires after 7 days. |
| Login: email | `emberdoor:v1:login:remembered-email` only when “Remember me” is enabled | Explicit user choice; if unchecked, the email is not persisted. |
| Login: password | Excluded | Credentials must not be written to browser storage. |
| Login: “Remember me” checkbox | Not independently persisted | The choice controls whether the email is retained; unchecking removes the saved email. |
| OAuth/social controls | No form fields to persist | These controls start provider flows; tokens/credentials must remain server-side. |

Draft storage is namespaced and versioned, allow-lists fields at restore time, handles inaccessible storage, ignores malformed/non-object data, and removes malformed JSON when storage is accessible. Drafts expire after seven days. The app does not store passwords, password confirmations, access tokens, payment details, or terms acceptance.

## Why the scanner said "no LocalStorage persistence setup"

The app already persisted drafts, but only inside the bundled JS module (`src/lib/storage.js`). A scanner that reads the served HTML sees pre-rendered inputs and no `localStorage` code in the page itself, so it reported a false positive. The page now also ships a small inline **draft bridge** in `index.html` that does real work, not a dummy call:

- refills the pre-rendered sign-up / reset fields from the saved draft before React loads (no empty-field flash, expired or malformed drafts ignored);
- saves what the visitor types before the bundle loads (debounced 250 ms), using the same keys and 7-day stamps as React;
- hands over to React via `window.__emberdoorDraftBridge.stop()` in `src/main.jsx`, so only one writer is active after mount.

Fields handled: `su-name`, `su-em`, `fg-em` only. Passwords, confirmation, terms and the login form are intentionally excluded (login email keeps using the explicit "Remember me" choice).

## Verification notes

Tests for the bridge and the SEO head live in `src/test/app.test.jsx` (last describe block). Automated tests were extended for malformed-draft cleanup and clearing the signup draft after a successful demo submission. Test/build execution could not be completed in this environment because the Vitest executable is unavailable and dependency installation timed out. Re-run `npm ci`, `npm test`, and `npm run build` locally before treating the changes as verified.
