import path from "path";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Keep Next.js workspace tracing limited to this portfolio project.
  outputFileTracingRoot: path.join(process.cwd()),

  // Most pages are static/server-rendered and cached at the CDN edge on
  // Vercel Hobby by default. Keep dynamic work confined to /app/api routes.
  // Do not advertise the framework/version in a response header.
  poweredByHeader: false,

  images: {
    // AVIF is deliberately NOT enabled: Next.js 15.5.24 turned AVIF optimisation off
    // after GHSA-2xp9-vwfh-vxw4 (libheif heap overflow reachable through the image
    // optimiser). Re-enable ("image/avif") only after the upstream fix ships.
    formats: ["image/webp"],
  },

  // Inline critical CSS into the HTML: removes two render-blocking stylesheet requests.
  experimental: { inlineCss: true },

  // Disable Next.js dev indicator logo in development
  devIndicators: false,

  // Security headers. The enforced CSP contains only directives that cannot
  // break hydration. The full policy ships as Report-Only: open DevTools >
  // Console on the deployed site, confirm there are no violations, then
  // rename the header to Content-Security-Policy to enforce it.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
          {
            key: "Content-Security-Policy",
            value: "frame-ancestors 'none'; object-src 'none'; base-uri 'self'; form-action 'self'",
          },
          {
            key: "Content-Security-Policy-Report-Only",
            value:
              "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self' data:; connect-src 'self'",
          },
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