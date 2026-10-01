// Reports which cost-sensitive features are enabled and which tier they're
// configured for. Reads only local env vars — makes no network calls, so
// it's always free and instant to run.
//
// Usage: npm run cost:check

import env from "@next/env";
const { loadEnvConfig } = env;
loadEnvConfig(process.cwd());

const flag = (name, fallback) => (process.env[name] ?? String(fallback)) === "true";
const has = (name) => Boolean(process.env[name] && process.env[name].length > 0);

const rows = [
  ["Hosting", "Vercel Hobby", "FREE"],
  ["Database", has("NEXT_PUBLIC_SUPABASE_URL") ? "Supabase Free (configured)" : "Not configured (not required)", "FREE"],
  ["Email", flag("ENABLE_CONTACT_FORM", true) ? (has("RESEND_API_KEY") ? "Resend Free (configured)" : "Resend Free (NOT configured)") : "Disabled", "FREE"],
  ["AI Assistant", flag("ENABLE_AI", true) ? (has("NVIDIA_API_KEY") ? "NVIDIA NIM (configured)" : "NVIDIA NIM (NOT configured)") : "Disabled", "FREE"],
  ["Analytics", flag("ENABLE_ANALYTICS", false) ? "Enabled (same-origin, no third party)" : "Disabled", "FREE"],
  ["CI/CD", "GitHub Actions", "FREE"],
];

const pad = (s, n) => String(s).padEnd(n);

console.log("\nPORTFOLIO COST CHECK\n");
for (const [label, value, cost] of rows) {
  console.log(`${pad(label, 16)} ${pad(value, 48)} ${cost}`);
}

console.log("\nAI daily budget:      ", process.env.AI_DAILY_LIMIT ?? "20 (default)");
console.log("AI per-IP/min:         ", process.env.AI_RATE_LIMIT_PER_IP_PER_MINUTE ?? "5 (default)");
console.log("Contact per-IP/hour:   ", process.env.CONTACT_RATE_LIMIT_PER_IP_PER_HOUR ?? "3 (default)");

console.log("\nEstimated monthly infrastructure: ₹0 (within free tiers)");
console.log("Estimated yearly infrastructure:  ₹0 (within free tiers)");
console.log("Custom domain: not included\n");
console.log(
  "Note: exact costs depend on usage, region, taxes and provider pricing changes — see COST_CONTROL.md.\n"
);
