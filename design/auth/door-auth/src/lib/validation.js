const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Each rule returns `true` or an error message. */
const rules = {
  name: (v) => v.trim().length >= 2 || "Enter your full name.",
  email: (v) => EMAIL.test(v.trim()) || "Enter a valid email address.",
  pwLogin: (v) => v.length >= 6 || "Password must be at least 6 characters.",
  pwNew: (v) =>
    (v.length >= 8 && /[a-z]/i.test(v) && /\d/.test(v)) ||
    "Use 8+ characters with letters and a number.",
  match: (v, values) => v === values.password || "Passwords do not match.",
};

/** Returns an error message, or "" when the value is valid. */
export function checkField(rule, value, values) {
  if (!value) return "This field is required.";
  const result = rules[rule](value, values);
  return result === true ? "" : result;
}

export const STRENGTH_LABELS = ["Too weak", "Weak", "Fair", "Good", "Strong"];

/** Password strength from 0 (empty / too weak) to 4 (strong). */
export function passwordStrength(value) {
  if (!value) return 0;
  let score = 0;
  if (value.length >= 8) score++;
  if (/[a-z]/.test(value) && /[A-Z]/.test(value)) score++;
  if (/\d/.test(value)) score++;
  if (/[^\w\s]/.test(value) || value.length >= 14) score++;
  return score;
}
