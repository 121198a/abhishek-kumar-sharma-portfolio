// Runtime RAG retrieval. Loads the precomputed index (static JSON, no DB)
// and does in-memory cosine similarity against a single query embedding —
// the only embedding call made per chat request.

import {
  getEmbedding,
  cosineSimilarity,
  type IndexedChunk,
  type VectorIndex,
} from "./embeddings";
import { recruiterCategoryBoost, type ChatMode } from "@/data/faq";
import rawIndex from "@/data/embeddings.generated.json";

const INDEX_METADATA: Partial<VectorIndex> | null =
  !Array.isArray(rawIndex) && typeof rawIndex === "object" && rawIndex !== null
    ? (rawIndex as unknown as Partial<VectorIndex>)
    : null;

const INDEX: IndexedChunk[] = Array.isArray(rawIndex)
  ? (rawIndex as IndexedChunk[])
  : Array.isArray(INDEX_METADATA?.chunks)
  ? INDEX_METADATA.chunks
  : [];

export type RagResult = {
  id: string;
  title: string;
  text: string;
  score: number;
  metadata: IndexedChunk["metadata"];
};

export type RagRetrieval = {
  chunks: RagResult[];
  used: boolean;
  /** Observability: rag_retrieval_success / rag_retrieval_empty / rag_retrieval_error (see route.ts logging). */
  reason:
    | "ok"
    | "index_empty"
    | "embedding_unavailable"
    | "below_threshold"
    | "dimension_mismatch";
};

export type RagOptions = {
  limit?: number;
  minScore?: number;
  timeoutMs?: number;
  /** Recruiter Mode: same similarity search, small nudge toward
   *  recruiter-relevant categories (skills/projects/experience/recruiter) —
   *  never invents relevance, only re-ranks genuine semantic matches. */
  mode?: ChatMode;
  /** Project Deep Dive: verified project slug (resolved server-side).
   *  Chunks already tagged with this project (metadata.projectId, see
   *  data/rag-chunks.ts) get a stronger nudge than the recruiter category
   *  boost — an explicitly selected project is a much stronger signal
   *  than a soft mode preference. */
  project?: string;
};

export async function ragRetrieve(query: string, opts: RagOptions = {}): Promise<RagRetrieval> {
  const limit = opts.limit ?? 3;
  const minScore = opts.minScore ?? 0.55;
  const mode = opts.mode ?? "general";
  const project = opts.project;

  // No index built yet (npm run index:knowledge not run, or no NVIDIA key
  // at index time) — degrade to "RAG unavailable" without attempting a
  // query embedding call at all.
  if (INDEX.length === 0) {
    return { chunks: [], used: false, reason: "index_empty" };
  }

  // Always use input_type: "query" for user queries
  const queryEmbedding = await getEmbedding(query, opts.timeoutMs ?? 4000, "query");
  if (!queryEmbedding) {
    return { chunks: [], used: false, reason: "embedding_unavailable" };
  }

  // Dimension validation
  if (INDEX_METADATA?.dimension && queryEmbedding.length !== INDEX_METADATA.dimension) {
    console.warn(
      `[rag] Query embedding dimension (${queryEmbedding.length}) does not match index dimension (${INDEX_METADATA.dimension}). Re-indexing required.`
    );
    return { chunks: [], used: false, reason: "dimension_mismatch" };
  }

  const scored = INDEX.map((c) => {
    const similarity = cosineSimilarity(queryEmbedding, c.embedding);
    const projectMatchBoost = project && c.metadata.projectId === project ? 0.15 : 0;
    return {
      id: c.id,
      title: c.title,
      text: c.text,
      metadata: c.metadata,
      score: similarity,
      boosted: similarity >= minScore
        ? similarity + recruiterCategoryBoost(c.metadata.category, mode, 0.05) + projectMatchBoost
        : similarity,
    };
  })
    .filter((c) => c.score >= minScore)
    .sort((a, b) => b.boosted - a.boosted)
    .slice(0, limit)
    .map(({ id, title, text, metadata, score }) => ({ id, title, text, metadata, score }));

  return {
    chunks: scored,
    used: scored.length > 0,
    reason: scored.length > 0 ? "ok" : "below_threshold",
  };
}
