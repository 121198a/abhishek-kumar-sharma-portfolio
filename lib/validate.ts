import { z } from "zod";

export function isNonEmptyString(v: unknown): v is string {
  return typeof v === "string" && v.trim().length > 0;
}

export function isValidEmail(v: string): boolean {
  if (typeof v !== "string" || /[\r\n]/.test(v)) return false;
  return z.string().email().safeParse(v.trim()).success;
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

// ─────────────────────────────────────────────────────────────────────────────
// Zod Schemas for API validation
// ─────────────────────────────────────────────────────────────────────────────

export const contactSchema = z.object({
  name: z
    .string("Name, email and message are all required.")
    .refine((val) => val.trim().length > 0, {
      message: "Name, email and message are all required.",
    })
    .refine((val) => val.trim().length <= 120, {
      message: "Name must be 120 characters or fewer.",
    }),
  email: z
    .string("Name, email and message are all required.")
    .refine((val) => val.trim().length > 0, {
      message: "Name, email and message are all required.",
    })
    .refine((val) => !/[\r\n]/.test(val) && isValidEmail(val.trim()), {
      message: "Please enter a valid email address.",
    })
    .refine((val) => val.trim().length <= 254, {
      message: "Email is too long.",
    }),
  message: z
    .string("Name, email and message are all required.")
    .refine((val) => val.trim().length > 0, {
      message: "Name, email and message are all required.",
    })
    .refine((val) => val.trim().length <= 2000, {
      message: "Message must be 2000 characters or fewer.",
    })
    .refine((val) => !looksLikeSpam(val), {
      message: "Message flagged as spam. Please revise and resend.",
    }),
  phone: z.string().max(40).optional(),
  subject: z.string().max(160).optional(),
  honeypot: z.string().optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;

export const chatSchema = z.object({
  message: z
    .string("message is required.")
    .refine((val) => val.trim().length > 0, {
      message: "message is required.",
    }),
  sessionMessageCount: z.unknown().optional(),
  mode: z.enum(["general", "recruiter"]).optional(),
  selectedProject: z.string().optional(),
  history: z.unknown().optional(),
});

export type ChatInput = z.infer<typeof chatSchema>;

