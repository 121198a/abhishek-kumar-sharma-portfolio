/**
 * AUTH SERVICE — REPLACE THIS.
 *
 * This is a demo stub: it accepts any well-formed input after a short delay and
 * performs NO real authentication. Swap the body for a call to your backend and
 * throw an Error with a user-readable message on failure.
 *
 *   const res = await fetch('/api/auth/' + mode, {
 *     method: 'POST',
 *     headers: { 'Content-Type': 'application/json' },
 *     credentials: 'include',
 *     body: JSON.stringify({ email, password, name, remember }),
 *   });
 *   if (!res.ok) throw new Error((await res.json()).message || 'Request failed');
 *   return res.json();
 *
 * Never log or persist the password on the client.
 */
export async function authenticate({ mode, email }) {
  await new Promise((resolve) => setTimeout(resolve, 900));
  return { mode, email };
}

/**
 * SOCIAL LOGIN (Google, Facebook).
 *
 * Real mode: set VITE_AUTH_BASE_URL in a .env file (see .env.example), e.g. http://localhost:4000/api/auth.
 * The button then sends the browser to `${VITE_AUTH_BASE_URL}/google` or `/facebook`. Your backend runs the
 * OAuth flow with the provider and sets the session cookie. You need an OAuth app (client ID and secret)
 * with each provider; the secrets must stay on the backend, never in this front end.
 *
 * Demo mode (no VITE_AUTH_BASE_URL): signs in a placeholder account after a short delay, like authenticate().
 */
export async function authenticateWithProvider(provider) {
  const base = import.meta.env.VITE_AUTH_BASE_URL;
  if (base) {
    window.location.assign(`${base.replace(/\/$/, '')}/${provider}`);
    return new Promise(() => {}); // the page is leaving; keep the button busy
  }
  await new Promise((resolve) => setTimeout(resolve, 900));
  return { provider, email: `${provider}.demo@example.com` };
}
