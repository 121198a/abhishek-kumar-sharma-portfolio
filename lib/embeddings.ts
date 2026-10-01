// NVIDIA embeddings client + cosine similarity. No external vector database —
// embeddings are stored in static JSON and searched in-memory at runtime.

import { createHash } from "node:crypto";
import type { FaqCategory } from "@/data/faq";

export const DEFAULT_EMBEDDING_MODEL = "nvidia/nemotron-3-embed-1b";
export const EXPECTED_EMBEDDING_DIMENSION = 2048;
export const INDEX_VERSION = 2;

export type RagChunkMetadata = {
  source: "faq";
  category: FaqCategory;
  /** Verified project slug (data/projects.ts) — undefined for non-project chunks. */
  projectId?: string;
};

export type RagChunk = {
  id: string;
  title: string;
  text: string;
  metadata: RagChunkMetadata;
};

export type IndexedChunk = RagChunk & { embedding: number[]; contentHash: string };

export type VectorIndex = {
  version: number;
  provider: "nvidia";
  model: string;
  dimension: number;
  createdAt: string;
  chunks: IndexedChunk[];
};

export type EmbeddingResult =
  | { ok: true; embedding: number[]; dimension: number; model: string }
  | { ok: false; error: string; status?: number; model: string };

/** Stable content hash for idempotent indexing — unchanged chunk content
 *  (same id + same text) means the same hash, so re-running the indexer
 *  never re-embeds or duplicates chunks that haven't changed. */
export function contentHash(text: string): string {
  return createHash("sha256").update(text).digest("hex").slice(0, 16);
}

export function embeddingConfig() {
  const apiKey = process.env.NVIDIA_API_KEY?.trim();
  const baseUrl = (process.env.NVIDIA_BASE_URL?.trim() || "https://integrate.api.nvidia.com/v1").replace(/\/$/, "");
  const model = process.env.NVIDIA_EMBEDDING_MODEL?.trim() || DEFAULT_EMBEDDING_MODEL;
  return { apiKey, baseUrl, model };
}

/**
 * Sanitizes any raw provider error response so API keys, secrets, or
 * sensitive authorization headers are never exposed in error logs.
 */
function sanitizeProviderError(rawText: string, status?: number): string {
  if (!rawText) return `HTTP ${status || "unknown"} error`;
  try {
    const json = JSON.parse(rawText);
    const detail = json.detail || json.message || json.error?.message || json.title;
    if (typeof detail === "string") {
      return detail.replace(/bearer\s+[a-z0-9_\-\.]+/gi, "Bearer [REDACTED]");
    }
  } catch {
    // raw text fallback
  }
  return rawText.slice(0, 300).replace(/bearer\s+[a-z0-9_\-\.]+/gi, "Bearer [REDACTED]");
}

/**
 * Low-level NVIDIA embedding API requester.
 * Validates HTTP status, parses provider response, and checks vector dimensions.
 */
export async function requestNvidiaEmbedding(
  text: string,
  inputType: "passage" | "query",
  timeoutMs = 8000
): Promise<EmbeddingResult> {
  const { apiKey, baseUrl, model } = embeddingConfig();
  if (!apiKey) {
    return { ok: false, error: "NVIDIA_API_KEY is not configured", model };
  }

  const trimmedText = text.trim();
  if (!trimmedText) {
    return { ok: false, error: "Input text cannot be empty", model };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(`${baseUrl}/embeddings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        Accept: "application/json",
      },
      signal: controller.signal,
      body: JSON.stringify({
        model,
        input: [trimmedText],
        input_type: inputType,
      }),
    });

    if (!res.ok) {
      let rawText = "";
      try {
        rawText = await res.text();
      } catch {
        // ignore read error
      }
      const sanitized = sanitizeProviderError(rawText, res.status);
      return {
        ok: false,
        error: `NVIDIA API error (${res.status}): ${sanitized}`,
        status: res.status,
        model,
      };
    }

    const data = await res.json();
    const vec = data?.data?.[0]?.embedding;

    if (!Array.isArray(vec) || vec.length === 0) {
      return {
        ok: false,
        error: "Malformed response: embedding array missing or empty",
        status: 200,
        model,
      };
    }

    return {
      ok: true,
      embedding: vec,
      dimension: vec.length,
      model,
    };
  } catch (err: unknown) {
    const isAbort = err instanceof Error && err.name === "AbortError";
    const msg = isAbort ? `Request timed out after ${timeoutMs}ms` : err instanceof Error ? err.message : String(err);
    return {
      ok: false,
      error: `Network failure: ${msg}`,
      model,
    };
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Embeds a document/knowledge chunk using `input_type: "passage"`.
 * Used for offline indexing in `scripts/build-embeddings.ts`.
 */
export async function embedDocument(text: string, timeoutMs = 12000): Promise<EmbeddingResult> {
  return requestNvidiaEmbedding(text, "passage", timeoutMs);
}

/**
 * Embeds a user search query using `input_type: "query"`.
 * Used for runtime semantic search in `lib/rag.ts`.
 */
export async function embedQuery(text: string, timeoutMs = 4000): Promise<EmbeddingResult> {
  return requestNvidiaEmbedding(text, "query", timeoutMs);
}

/**
 * Backward-compatible helper for embedding a single string.
 * Defaults to `inputType: "query"`.
 * Returns `number[] | null` without throwing.
 */
export async function getEmbedding(
  text: string,
  timeoutMs = 4000,
  inputType: "passage" | "query" = "query"
): Promise<number[] | null> {
  const result = await requestNvidiaEmbedding(text, inputType, timeoutMs);
  return result.ok ? result.embedding : null;
}

export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length || a.length === 0) return 0;
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  if (na === 0 || nb === 0) return 0;
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}
