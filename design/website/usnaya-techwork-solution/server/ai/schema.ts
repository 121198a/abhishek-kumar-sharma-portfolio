
import { z } from "zod";
import { isAllowedDestination } from "../security/allowlist.ts";

export const MAX_MESSAGE = 300;

export const requestSchema = z.object({
  sessionId: z.string().min(1).max(64).optional(),
  characterId: z.string().min(1).max(64).regex(/^[a-z0-9-]+$/),
  departmentId: z.string().min(1).max(64).regex(/^[a-z0-9-]+$/),
  message: z.string().trim().min(1).max(MAX_MESSAGE),
});

export type ChatRequest = z.infer<typeof requestSchema>;

export const providerOutputSchema = z.object({
  message: z.string().min(1).max(600),
  suggestedReplies: z.array(z.string().min(1).max(120)).max(3).default([]),
  action: z
    .object({
      type: z.literal("navigate"),
      targetId: z.string(),
    })
    .nullable()
    .default(null),
});

export type ChatResponse = {
  message: string;
  suggestedReplies: string[];
  action: { type: "navigate"; targetId: string } | null;
};

/** Validates untrusted provider output. Unknown actions are dropped, never executed. */
export function sanitizeOutput(raw: unknown): ChatResponse | null {
  const parsed = providerOutputSchema.safeParse(raw);

  if (!parsed.success) return null;

  const { message, suggestedReplies, action } = parsed.data;

  return {
    message,
    suggestedReplies,
    action:
      action && isAllowedDestination(action.targetId)
        ? { type: "navigate", targetId: action.targetId }
        : null,
  };
}
