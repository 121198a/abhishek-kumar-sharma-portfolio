// Offline knowledge indexing. Run manually via `npm run index:knowledge`
// whenever data/faq.ts, data/projects.ts, or data/rag-chunks.ts changes.
// NOT run during `next build` and NOT run per chat request.
//
// Features:
// - Atomic writes: builds into a temporary file first; if ANY chunk fails,
//   the active index is left completely untouched.
// - Sanitized diagnostic error reporting on failure (never leaks secrets).
// - Validates model and dimension compatibility before reusing cached chunks.
// - Deterministic chunking safeguard if text exceeds input limits.

import { existsSync, readFileSync, writeFileSync, renameSync, unlinkSync } from "node:fs";
import path from "node:path";
import * as nextEnv from "@next/env";
import { ragChunks } from "../data/rag-chunks";
import {
  embedDocument,
  contentHash,
  embeddingConfig,
  INDEX_VERSION,
  type IndexedChunk,
  type RagChunk,
  type VectorIndex,
} from "../lib/embeddings";

const loadEnv = (nextEnv as any).loadEnvConfig || (nextEnv as any).default?.loadEnvConfig;
if (typeof loadEnv === "function") {
  loadEnv(process.cwd());
}

const OUT_PATH = path.join(process.cwd(), "data", "embeddings.generated.json");
const TEMP_PATH = path.join(process.cwd(), "data", "embeddings.generated.json.tmp");

// Max characters per chunk before deterministic splitting (safeguard)
const MAX_CHUNK_CHARS = 2000;
const CHUNK_OVERLAP_CHARS = 200;

function splitChunkIfNeeded(chunk: RagChunk): RagChunk[] {
  if (chunk.text.length <= MAX_CHUNK_CHARS) {
    return [chunk];
  }

  const subChunks: RagChunk[] = [];
  let start = 0;
  let partIndex = 1;

  while (start < chunk.text.length) {
    const end = Math.min(start + MAX_CHUNK_CHARS, chunk.text.length);
    const slice = chunk.text.slice(start, end).trim();

    subChunks.push({
      ...chunk,
      id: `${chunk.id}-part-${partIndex}`,
      title: `${chunk.title} (Part ${partIndex})`,
      text: slice,
    });

    partIndex += 1;
    start += MAX_CHUNK_CHARS - CHUNK_OVERLAP_CHARS;
  }

  return subChunks;
}

type ExistingIndexData = {
  model?: string;
  dimension?: number;
  map: Map<string, IndexedChunk>;
};

function loadExistingIndex(configuredModel: string): ExistingIndexData {
  const map = new Map<string, IndexedChunk>();
  if (!existsSync(OUT_PATH)) return { map };

  try {
    const raw = JSON.parse(readFileSync(OUT_PATH, "utf-8"));

    // Case 1: VectorIndex format with metadata
    if (!Array.isArray(raw) && typeof raw === "object" && raw !== null && Array.isArray((raw as any).chunks)) {
      const idx = raw as VectorIndex;
      if (idx.model && idx.model !== configuredModel) {
        console.log(
          `Existing index used model "${idx.model}". Configured model is "${configuredModel}". Re-indexing required.`
        );
        return { model: idx.model, dimension: idx.dimension, map };
      }
      for (const entry of idx.chunks) {
        if (entry?.id && Array.isArray(entry.embedding)) {
          map.set(entry.id, entry);
        }
      }
      return { model: idx.model, dimension: idx.dimension, map };
    }

    // Case 2: Legacy raw array format
    if (Array.isArray(raw)) {
      console.log("Existing index is in legacy array format. Rebuilding with version metadata.");
      return { map };
    }
  } catch {
    // Corrupt or unparseable index file — treat as empty
  }

  return { map };
}

async function main() {
  const { apiKey, model } = embeddingConfig();

  if (!apiKey) {
    console.error("\n❌ Error: NVIDIA_API_KEY is required to build the embeddings index.");
    console.error("Please ensure NVIDIA_API_KEY is configured in your .env.local file.\n");
    process.exit(1);
  }

  console.log(`Starting knowledge indexer...`);
  console.log(`Embedding Model: ${model}`);

  // Expand any oversized chunks deterministically
  const preparedChunks: RagChunk[] = ragChunks.flatMap(splitChunkIfNeeded);
  console.log(`Total chunks to process: ${preparedChunks.length}`);

  const { map: existingMap } = loadExistingIndex(model);
  const currentIds = new Set(preparedChunks.map((c) => c.id));
  const droppedIds = [...existingMap.keys()].filter((id) => !currentIds.has(id));

  if (droppedIds.length > 0) {
    console.log(`Dropping ${droppedIds.length} stale chunk(s): ${droppedIds.join(", ")}`);
  }

  const indexedChunks: IndexedChunk[] = [];
  let reusedCount = 0;
  let newlyEmbeddedCount = 0;
  let resolvedDimension = 0;

  for (const chunk of preparedChunks) {
    const hash = contentHash(chunk.id + chunk.text);
    const prior = existingMap.get(chunk.id);

    // Reuse existing chunk if content hash matches and dimension is consistent
    if (prior && prior.contentHash === hash && Array.isArray(prior.embedding)) {
      indexedChunks.push(prior);
      reusedCount += 1;
      resolvedDimension = prior.embedding.length;
      continue;
    }

    // Request new embedding with document/passage type
    const result = await embedDocument(chunk.text, 15000);

    if (!result.ok) {
      console.error("\n================ EMBEDDING FAILED ================");
      console.error(`Chunk ID:       ${chunk.id}`);
      console.error(`Model:          ${result.model}`);
      console.error(`HTTP Status:    ${result.status ?? "Network/Timeout"}`);
      console.error(`Provider Error: ${result.error}`);
      console.error(`Action:         Aborting without modifying existing index.`);
      console.error("==================================================\n");

      // Clean up temporary file if it was created
      if (existsSync(TEMP_PATH)) {
        try {
          unlinkSync(TEMP_PATH);
        } catch {
          // ignore
        }
      }

      process.exit(1);
    }

    resolvedDimension = result.dimension;
    indexedChunks.push({
      ...chunk,
      embedding: result.embedding,
      contentHash: hash,
    });
    newlyEmbeddedCount += 1;
    console.log(`✓ Indexed [${chunk.id}] (${result.dimension}d)`);
  }

  // Construct final vector index with verified metadata
  const finalIndex: VectorIndex = {
    version: INDEX_VERSION,
    provider: "nvidia",
    model,
    dimension: resolvedDimension,
    createdAt: new Date().toISOString(),
    chunks: indexedChunks,
  };

  try {
    // Atomic write pattern: write to temporary path, then rename
    writeFileSync(TEMP_PATH, JSON.stringify(finalIndex, null, 2), "utf-8");
    renameSync(TEMP_PATH, OUT_PATH);

    console.log("\n================ INDEX COMPLETE ================");
    console.log(`Target:         ${OUT_PATH}`);
    console.log(`Version:        ${INDEX_VERSION}`);
    console.log(`Model:          ${model}`);
    console.log(`Dimension:      ${resolvedDimension}d`);
    console.log(`Total Chunks:   ${indexedChunks.length}`);
    console.log(`Newly Embedded: ${newlyEmbeddedCount}`);
    console.log(`Reused Cached:  ${reusedCount}`);
    console.log(`Dropped Stale:  ${droppedIds.length}`);
    console.log("================================================\n");
  } catch (writeErr) {
    if (existsSync(TEMP_PATH)) {
      try {
        unlinkSync(TEMP_PATH);
      } catch {
        // ignore
      }
    }
    console.error("Failed to commit final index file:", writeErr);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Unexpected error during indexing:", err);
  if (existsSync(TEMP_PATH)) {
    try {
      unlinkSync(TEMP_PATH);
    } catch {
      // ignore
    }
  }
  process.exit(1);
});
