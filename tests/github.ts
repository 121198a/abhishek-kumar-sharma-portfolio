// Run with: npm run test:github
import { normalizeRepos, languageCounts, getGitHubData } from "../lib/github";
import { githubSnapshot } from "../data/github-snapshot";

let failures = 0;
const check = (ok: boolean, msg: string) => { if (!ok) { failures++; console.error("FAIL:", msg); } else console.log("ok  :", msg); };

// 1. normalisation drops forks, the profile repo, private and malformed rows; sorts newest first
const repos = normalizeRepos([
  { name: "a", fork: false, pushed_at: "2026-01-01T00:00:00Z", language: "TypeScript", description: "d" },
  { name: "b", fork: true, pushed_at: "2026-09-01T00:00:00Z" },
  { name: "121198a", fork: false, pushed_at: "2026-10-01T00:00:00Z" },
  { name: "c", fork: false, pushed_at: "2026-05-01T00:00:00Z", language: null, description: null },
  { name: "bad name!", fork: false },
  null, 42, { name: 7 },
]);
check(repos.map((r) => r.name).join() === "c,a", "normalizeRepos filters forks/profile/malformed and sorts newest first");
check(normalizeRepos([{ name: "x", private: true }]).length === 0, "private repos are dropped");
let threw = false; try { normalizeRepos({ message: "rate limited" }); } catch { threw = true; }
check(threw, "non-array payload (e.g. rate-limit message) throws so the snapshot fallback is used");

// 2. language counts
const lc = languageCounts([{ name: "a", language: "TypeScript", description: null, updatedAt: null }, { name: "b", language: "TypeScript", description: null, updatedAt: null }, { name: "c", language: null, description: null, updatedAt: null }, { name: "d", language: "Java", description: null, updatedAt: null }]);
check(lc[0].language === "TypeScript" && lc[0].count === 2 && lc.length === 2, "languageCounts ignores repos without a language");

// 3. snapshot sanity: no forks, valid names
check(githubSnapshot.length > 0 && githubSnapshot.every((r) => /^[A-Za-z0-9._-]+$/.test(r.name)), "snapshot has valid repo names");

// 4. fallback: failing fetch -> snapshot (never throws)
const realFetch = globalThis.fetch;
(async () => {
  globalThis.fetch = (async () => { throw new Error("offline"); }) as typeof fetch;
  const a = await getGitHubData(); check(a.source === "snapshot" && a.repos.length > 0, "network failure -> snapshot");
  globalThis.fetch = (async () => new Response(JSON.stringify({ message: "rate limit" }), { status: 403 })) as typeof fetch;
  const b = await getGitHubData(); check(b.source === "snapshot", "HTTP 403 -> snapshot");
  globalThis.fetch = (async () => new Response(JSON.stringify([{ name: "live-repo", fork: false, pushed_at: "2026-10-02T00:00:00Z", language: "Python" }]), { status: 200 })) as typeof fetch;
  const c = await getGitHubData(); check(c.source === "live" && c.repos[0].name === "live-repo", "valid response -> live data");
  globalThis.fetch = realFetch;
  if (failures) { console.error(`\n${failures} failure(s)`); process.exit(1); }
  console.log("\nGitHub data tests passed");
})();
