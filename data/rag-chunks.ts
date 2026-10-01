// RAG documents — Phase 6: semantically chunked, not one-paragraph-per-topic.
//
// Two sources, both verified, no invented content:
//  1. Project chunks are split per-project into "Overview" and
//     "Technologies" sub-chunks, built directly from data/projects.ts
//     fields (description/approach/tags/category/year/status) — nothing
//     beyond what's already documented there. This gives Project Deep
//     Dive finer-grained retrieval (e.g. a "what database" question can
//     match the Technologies chunk specifically) without fabricating
//     Features/Backend/Architecture sections the portfolio doesn't
//     actually document per-project.
//  2. All non-project categories reuse the Phase 1 faq.ts entries
//     one-to-one (they're already short, single-topic, verified answers —
//     splitting them further would produce "one-sentence meaningless
//     chunks", which the chunking guidance explicitly warns against).

import { faq, FAQ_PROJECT_SLUG } from "./faq";
import { projects } from "./projects";
import type { RagChunk } from "@/lib/embeddings";

const projectChunks: RagChunk[] = projects.flatMap((p): RagChunk[] => [
  {
    id: `project-${p.slug}-overview`,
    title: `${p.name} — Overview`,
    text: `${p.name} (${p.category}, ${p.year}, ${p.status}): ${p.description}`,
    metadata: { source: "faq" as const, category: "projects" as const, projectId: p.slug },
  },
  ...(p.approach || p.tags.length > 0
    ? [
        {
          id: `project-${p.slug}-technologies`,
          title: `${p.name} — Technologies`,
          text: [
            p.approach ? `Approach: ${p.approach}` : null,
            p.tags.length > 0 ? `Technologies: ${p.tags.join(", ")}` : null,
          ]
            .filter((s): s is string => Boolean(s))
            .join(" "),
          metadata: { source: "faq" as const, category: "projects" as const, projectId: p.slug },
        },
      ]
    : []),
]);

// Non-project faq.ts entries — already single-topic verified answers.
// Their own "project-*" entries are excluded here since projectChunks
// above supersedes them with finer granularity (avoids duplicate chunks
// for the same fact).
const nonProjectFaqChunks: RagChunk[] = faq
  .filter((entry) => !(entry.id in FAQ_PROJECT_SLUG))
  .map((entry) => ({
    id: entry.id,
    title: entry.id.replace(/-/g, " "),
    text: entry.answer,
    metadata: { source: "faq", category: entry.category },
  }));

export const ragChunks: RagChunk[] = [...projectChunks, ...nonProjectFaqChunks];
