// Server-only GitHub data. Free: unauthenticated API allows 60 requests/hour
// per IP and this runs at most once per 24 h (ISR cache). An optional
// GITHUB_TOKEN (server env, never sent to the browser) raises the limit — worth
// setting because shared build IPs can be rate limited. On any failure the
// committed snapshot is used and the UI labels it as a snapshot.

import { GITHUB_USER, githubSnapshot, SNAPSHOT_DATE } from "@/data/github-snapshot";

export type GitHubRepo = {
  name: string;
  description: string | null;
  language: string | null;
  updatedAt: string | null;
};

export type GitHubData = {
  repos: GitHubRepo[];
  source: "live" | "snapshot";
  asOf: string; // ISO date
  profileUrl: string;
};

const PROFILE_REPO = GITHUB_USER; // the special profile README repo

/** Validate/normalise the API payload. Drops forks, the profile repo and malformed rows. */
export function normalizeRepos(payload: unknown): GitHubRepo[] {
  if (!Array.isArray(payload)) throw new Error("unexpected GitHub payload");
  const out: GitHubRepo[] = [];
  for (const r of payload) {
    if (!r || typeof r !== "object") continue;
    const o = r as Record<string, unknown>;
    if (typeof o.name !== "string" || !/^[A-Za-z0-9._-]+$/.test(o.name)) continue;
    if (o.fork === true || o.name === PROFILE_REPO || o.private === true) continue;
    out.push({
      name: o.name,
      description: typeof o.description === "string" ? o.description : null,
      language: typeof o.language === "string" ? o.language : null,
      updatedAt: typeof o.pushed_at === "string" ? o.pushed_at : typeof o.updated_at === "string" ? o.updated_at : null,
    });
  }
  return out.sort((a, b) => (b.updatedAt ?? "").localeCompare(a.updatedAt ?? ""));
}

function snapshot(): GitHubData {
  return {
    repos: githubSnapshot.filter((r) => r.name !== PROFILE_REPO),
    source: "snapshot",
    asOf: SNAPSHOT_DATE,
    profileUrl: `https://github.com/${GITHUB_USER}`,
  };
}

export async function getGitHubData(): Promise<GitHubData> {
  try {
    const token = process.env.GITHUB_TOKEN?.trim();
    const res = await fetch(`https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=pushed`, {
      headers: {
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      next: { revalidate: 60 * 60 * 24 },
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) throw new Error(`GitHub API ${res.status}`);
    const repos = normalizeRepos(await res.json());
    if (repos.length === 0) throw new Error("no repositories returned");
    return { repos, source: "live", asOf: new Date().toISOString().slice(0, 10), profileUrl: `https://github.com/${GITHUB_USER}` };
  } catch {
    return snapshot();
  }
}

/** Repositories per primary language (repos with no detected language are omitted). */
export function languageCounts(repos: GitHubRepo[]): { language: string; count: number }[] {
  const m = new Map<string, number>();
  for (const r of repos) if (r.language) m.set(r.language, (m.get(r.language) ?? 0) + 1);
  return [...m.entries()].map(([language, count]) => ({ language, count })).sort((a, b) => b.count - a.count);
}
