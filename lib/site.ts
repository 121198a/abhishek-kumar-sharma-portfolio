// Canonical single source of truth for site configuration and domain resolution.
// Configure NEXT_PUBLIC_SITE_URL in production environment variables (e.g., Vercel)
// or default gracefully to the deployed Vercel domain.

export const siteConfig = {
  url: process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://abhishek-portfolio.vercel.app",
};
