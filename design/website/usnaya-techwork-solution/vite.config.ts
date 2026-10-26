
import { defineConfig, type Plugin } from "vitest/config";
import react from "@vitejs/plugin-react";
import { createApp } from "./server/app.ts";
import { createLocalProvider } from "./server/ai/provider.ts";

/** Production-only Content-Security-Policy. Skipped in dev because Vite's hot-reload preamble is an inline script. */
function contentSecurityPolicyPlugin(): Plugin {
  const policy = [
    "default-src 'self'",
    "script-src 'self'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "font-src 'self' data:",
    "connect-src 'self'",
    "worker-src 'self' blob:",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join("; ");

  return {
    name: "content-security-policy",
    apply: "build",
    transformIndexHtml: () => [
      {
        tag: "meta",
        attrs: {
          "http-equiv": "Content-Security-Policy",
          content: policy,
        },
        injectTo: "head-prepend",
      },
    ],
  };
}

function conversationApiDevPlugin(): Plugin {
  return {
    name: "conversation-api-dev",
    configureServer(server) {
      const app = createApp({
        provider: createLocalProvider(),
        allowedOrigins: [
          "http://localhost:5173",
          "http://127.0.0.1:5173",
        ],
        dailyCap: 500,
      });

      server.middlewares.use((req, res, next) => {
        if (req.url?.startsWith("/api") || req.url?.startsWith("/health")) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (app as any)(req, res, next);
        } else {
          next();
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [
    react(),
    conversationApiDevPlugin(),
    contentSecurityPolicyPlugin(),
  ],

  // Prevent this project from inheriting the parent Tailwind PostCSS config.
  css: {
    postcss: {
      plugins: [],
    },
  },

  server: {
    port: 5173,
  },

  build: {
    chunkSizeWarningLimit: 1500,
  },

  test: {
    environment: "node",
    include: ["src/**/*.test.ts", "server/**/*.test.ts"],
  },
});
