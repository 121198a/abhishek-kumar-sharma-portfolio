/*
 * Auth adapter. FRONTEND DEMO ONLY: nothing is verified or stored and
 * passwords are never saved. Replace these functions with real API calls
 * (fetch that throws on failure). See README.
 */
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const AuthAdapter = {
  demo: true,

  async login({ email }) {
    await wait(900);
    return { ok: true, demo: true, name: email.split("@")[0] };
  },

  async signup({ name }) {
    await wait(1100);
    return { ok: true, demo: true, name: name.trim().split(" ")[0] };
  },

  async forgot() {
    await wait(800);
    return { ok: true, demo: true };
  },

  async oauth(provider) {
    await wait(700);
    throw new Error(
      `${provider} sign-in is not configured yet. See README > OAuth.`,
    );
  },
};
