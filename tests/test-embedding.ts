// Small standalone integration test for NVIDIA embedding API.
// Verifies passage and query embedding requests without indexing the full KB.
// Run: npm run test:embedding

import * as nextEnv from "@next/env";
import { embedDocument, embedQuery, embeddingConfig } from "../lib/embeddings";

const loadEnv = (nextEnv as any).loadEnvConfig || (nextEnv as any).default?.loadEnvConfig;
if (typeof loadEnv === "function") {
  loadEnv(process.cwd());
}

async function runEmbeddingTest() {
  const { apiKey, model } = embeddingConfig();

  if (!apiKey) {
    console.log("ℹ️  NVIDIA_API_KEY is not configured — skipping live embedding test.");
    console.log("   (Portfolio continues to function with deterministic fallback).");
    process.exit(0);
  }

  console.log(`Testing NVIDIA embedding client...`);
  console.log(`Configured Model: ${model}`);

  // Test 1: Document/Passage embedding
  const docResult = await embedDocument("Hello world, this is a test document passage.");
  if (!docResult.ok) {
    console.error(`❌ Document embedding failed.`);
    console.error(`   Error: ${docResult.error}`);
    console.error(`   Status: ${docResult.status ?? "Network/Timeout"}`);
    classifyError(docResult.status);
    process.exit(1);
  }

  console.log(`✓ Document passage embedding succeeded: ${docResult.dimension} dimensions.`);

  // Test 2: Query embedding
  const queryResult = await embedQuery("Hello world test query");
  if (!queryResult.ok) {
    console.error(`❌ Query embedding failed.`);
    console.error(`   Error: ${queryResult.error}`);
    console.error(`   Status: ${queryResult.status ?? "Network/Timeout"}`);
    classifyError(queryResult.status);
    process.exit(1);
  }

  console.log(`✓ Query embedding succeeded: ${queryResult.dimension} dimensions.`);

  // Test 3: Dimension consistency
  if (docResult.dimension !== queryResult.dimension) {
    console.error(
      `❌ Dimension mismatch between document (${docResult.dimension}) and query (${queryResult.dimension}).`
    );
    process.exit(1);
  }

  console.log(`✓ Dimension consistency verified: ${docResult.dimension}d matches for both passage and query.`);
  console.log(`\nAll embedding integration tests passed successfully!`);
}

function classifyError(status?: number) {
  if (status === 401) {
    console.error("   Category: Authentication Error — invalid, malformed, or expired NVIDIA API key.");
  } else if (status === 404 || status === 410) {
    console.error("   Category: Model Unavailable — the requested model ID is retired or not in your catalog.");
  } else if (status === 429) {
    console.error("   Category: Rate Limit — NVIDIA API rate limit exceeded.");
  } else if (status === 400) {
    console.error("   Category: Invalid Request — the request payload format was rejected.");
  } else if (status && status >= 500) {
    console.error("   Category: Provider Error — NVIDIA API service issue.");
  } else {
    console.error("   Category: Network / Configuration Error.");
  }
}

runEmbeddingTest().catch((err) => {
  console.error("Unexpected error in embedding test:", err);
  process.exit(1);
});
