import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// In `npm run dev`, put the server-rendered app into index.html too, so the
// served HTML matches the production build. (The build uses scripts/prerender.mjs.)
function prerenderInDev() {
  return {
    name: "emberdoor-prerender-dev",
    apply: "serve",
    async transformIndexHtml(html, ctx) {
      if (!ctx.server) return html;
      try {
        const { render } = await ctx.server.ssrLoadModule("/src/entry-server.jsx");
        return html.replace('<div id="root"></div>', () => `<div id="root">${render()}</div>`);
      } catch (error) {
        ctx.server.config.logger.warn(`prerender skipped: ${error.message}`);
        return html;
      }
    },
  };
}

// Canonical / og:url / og:image / JSON-LD url must be absolute. index.html uses %SITE_URL%:
//  - build: set SITE_URL (e.g. SITE_URL=https://emberdoor.example npm run build);
//    without it those tags are removed instead of shipping a wrong address.
//  - dev:   the dev server's own origin is used (e.g. http://localhost:5173).
function siteUrl(mode) {
  let configured = "";
  const fromEnv = process.env.SITE_URL || loadEnv(mode, process.cwd(), "").SITE_URL || "";
  configured = fromEnv.trim().replace(/\/+$/, "");
  let warned = false;
  return {
    name: "emberdoor-site-url",
    transformIndexHtml: {
      order: "pre",
      handler(html, ctx) {
        let base = configured;
        if (!base && ctx.server) {
          const { port = 5173, https } = ctx.server.config.server;
          base = ctx.server.resolvedUrls?.local?.[0]?.replace(/\/+$/, "") || `${https ? "https" : "http"}://localhost:${port}`;
        }
        if (base) return html.replaceAll("%SITE_URL%", base);
        if (!warned) {
          warned = true;
          console.warn("[emberdoor] SITE_URL not set: canonical, og:url, og:image and JSON-LD url were omitted.");
        }
        return html
          .split("\n")
          .filter((line) => !line.includes("%SITE_URL%"))
          .join("\n");
      },
    },
  };
}

export default defineConfig(({ mode }) => ({
  plugins: [react(), siteUrl(mode), prerenderInDev()],
  test: {
    environment: "jsdom",
    include: ["src/test/**/*.test.jsx"],
  },
}));
