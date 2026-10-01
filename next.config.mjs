import path from "path";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Keep Next.js workspace tracing limited to this portfolio project.
  outputFileTracingRoot: path.join(process.cwd()),

  // Most pages are static/server-rendered and cached at the CDN edge on
  // Vercel Hobby by default. Keep dynamic work confined to /app/api routes.
  images: {
    formats: ["image/avif", "image/webp"],
  },

  // Disable Next.js dev indicator logo in development
  devIndicators: false,

  // Safe, non-breaking headers only — no CSP here, since a real CSP needs
  // careful testing against Next.js's inline hydration scripts and would
  // risk breaking the app; flagged in the security report instead of
  // guessed at.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;