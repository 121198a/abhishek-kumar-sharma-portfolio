import cors from "cors";
import express, { type ErrorRequestHandler } from "express";
import rateLimit from "express-rate-limit";
import { randomUUID } from "node:crypto";
import type { Provider } from "./ai/provider.ts";
import { requestSchema, sanitizeOutput } from "./ai/schema.ts";
import { DailyCap } from "./security/usageCap.ts";

export type AppOptions = {
  provider: Provider;
  allowedOrigins: string[];
  dailyCap: number;
  ratePerMinute?: number;
  timeoutMs?: number;
};

const err = (code: string, message: string, retryable: boolean) => ({ error: { code, message, retryable } });

export function createApp(opts: AppOptions) {
  const app = express();
  const cap = new DailyCap(opts.dailyCap);
  app.disable("x-powered-by");
  app.set("trust proxy", 1);

  app.use(
    cors({
      origin(origin, cb) {
        // same-origin / non-browser requests have no Origin header
        if (!origin || opts.allowedOrigins.includes(origin)) cb(null, true);
        else cb(null, false);
      },
      methods: ["POST", "GET"],
    }),
  );
  app.use((_req, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "SAMEORIGIN");
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    res.setHeader("Cache-Control", "no-store");
    next();
  });
  app.use(express.json({ limit: "4kb" }));

  app.get("/health", (_req, res) => {
    res.json({ ok: true, provider: opts.provider.name });
  });

  app.post(
    "/api/conversations/message",
    rateLimit({
      windowMs: 60_000,
      limit: opts.ratePerMinute ?? 20,
      standardHeaders: true,
      legacyHeaders: false,
      handler: (_req, res) => res.status(429).json(err("RATE_LIMITED", "Too many questions. Please wait a moment.", true)),
    }),
    async (req, res) => {
      const id = randomUUID();
      const started = Date.now();
      const log = (status: number, note: string) => console.log(JSON.stringify({ id, status, ms: Date.now() - started, note }));

      const parsed = requestSchema.safeParse(req.body);
      if (!parsed.success) {
        log(400, "invalid_request");
        return res.status(400).json(err("INVALID_REQUEST", "The question could not be read.", false));
      }
      if (!cap.take()) {
        log(429, "daily_cap");
        return res.status(429).json(err("DAILY_CAP", "The assistant has reached its daily limit.", false));
      }
      try {
        const raw = await Promise.race([
          opts.provider.generate(parsed.data),
          new Promise<never>((_, reject) => setTimeout(() => reject(new Error("timeout")), opts.timeoutMs ?? 9000)),
        ]);
        const safe = sanitizeOutput(raw);
        if (!safe) {
          log(502, "invalid_provider_output");
          return res.status(502).json(err("BAD_UPSTREAM", "The assistant gave an unusable answer.", true));
        }
        log(200, "ok");
        return res.json(safe);
      } catch (e) {
        const timeout = e instanceof Error && e.message === "timeout";
        log(timeout ? 504 : 502, timeout ? "timeout" : "provider_error");
        return res.status(timeout ? 504 : 502).json(err(timeout ? "TIMEOUT" : "UPSTREAM_ERROR", "The assistant is unavailable right now.", true));
      }
    },
  );

  // Express identifies error handlers by their 4-argument signature, so `_next` must stay.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onError: ErrorRequestHandler = (e, _req, res, _next) => {
    const status = typeof e?.status === "number" ? e.status : 500;
    res.status(status >= 400 && status < 500 ? status : 500).json(err(status === 413 ? "TOO_LARGE" : "BAD_REQUEST", "The request was not accepted.", false));
  };
  app.use(onError);
  return app;
}
