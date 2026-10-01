export function isNonEmptyString(v: unknown): v is string {
  return typeof v === "string" && v.trim().length > 0;
}

export function isValidEmail(v: string): boolean {
  // Deliberately simple — good enough to catch typos, not a full RFC5322 check.
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

export function clampLength(v: string, max: number): string {
  return v.length > max ? v.slice(0, max) : v;
}

// Defense-in-depth: strips CR/LF and other control characters before a
// value is used anywhere that could resemble a header (e.g. an email
// subject line built from a visitor-supplied name). Resend's JSON API
// doesn't construct raw SMTP headers from these fields the way a naive
// mail() call would, but stripping control characters here costs nothing
// and removes the question entirely.
export function stripControlChars(v: string): string {
  // eslint-disable-next-line no-control-regex
  return v.replace(/[\r\n\x00-\x1f\x7f]/g, " ").trim();
}

// Very small heuristic to reject obvious spam/bot submissions without
// needing a paid captcha service.
export function looksLikeSpam(text: string): boolean {
  const linkCount = (text.match(/https?:\/\//gi) ?? []).length;
  if (linkCount >= 3) return true;
  if (text.length > 0 && text.replace(/[^A-Z]/g, "").length / text.length > 0.7) return true;
  return false;
}
