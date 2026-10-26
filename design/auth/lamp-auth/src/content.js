// All visible copy lives here so it is easy to change without touching components.
export const content = {
  brand: { name: 'LUMINA', suffix: 'VAULT' },
  hero: {
    badge: 'Safe, simple sign-in',
    title: 'Your private vault is one step away.',
    body: 'Sign in or create an account in seconds. Set the mood with the chandelier while your details stay protected.',
    chips: ['Secure UI', 'Biometric Feel', 'Fast Motion'],
  },
  titles: { login: 'Log in | LuminaVault', signup: 'Create account | LuminaVault', granted: 'Signed in | LuminaVault' },
  tabs: { login: 'Login', signup: 'Signup' },
  login: { title: 'Welcome Back', sub: 'Enter your details to continue.', submit: 'Login Now', busy: 'Signing in…' },
  signup: { title: 'Create Account', sub: 'Start your premium journey today.', submit: 'Create Account', busy: 'Creating account…' },
  granted: { title: 'Access granted', sub: 'You are signed in.', exit: 'Sign out' },
  errors: {
    email: 'Enter a valid email address, like name@example.com.',
    password: 'Password must be at least 8 characters.',
    terms: 'Please accept the privacy terms to continue.',
    generic: 'Something went wrong. Please try again.',
  },
  social: { label: 'Or continue with', google: 'Google', facebook: 'Facebook' },
  notices: {
    reset: 'Password reset is not connected yet. Wire it in src/services/auth.js.',
  },
  footer: 'LuminaVault',
};
