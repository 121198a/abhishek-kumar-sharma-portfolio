// Simple rule-based password strength. This is a UI hint, not a security guarantee.
export function calculateStrength(secret) {
  const criteria = {
    len: secret.length >= 8,
    mix: /[a-z]/.test(secret) && /[A-Z]/.test(secret),
    num: /[0-9]/.test(secret),
    sym: /[^A-Za-z0-9]/.test(secret),
  };
  if (!secret) return { score: 0, grade: 'Not set', bar: 'bg-zinc-400', criteria };

  let score = 0;
  if (criteria.len) score += 25;
  if (secret.length >= 12) score += 15;
  if (criteria.mix) score += 25;
  if (criteria.num) score += 20;
  if (criteria.sym) score += 15;
  score = Math.min(100, score);

  if (score >= 80) return { score, grade: 'Strong', bar: 'bg-teal-500', criteria };
  if (score >= 60) return { score, grade: 'Good', bar: 'bg-yellow-500', criteria };
  if (score >= 40) return { score, grade: 'Fair', bar: 'bg-amber-500', criteria };
  return { score, grade: 'Weak', bar: 'bg-rose-500', criteria };
}
