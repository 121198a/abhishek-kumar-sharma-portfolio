import React from "react";
import { getGitHubData, languageCounts } from "@/lib/github";
import Reveal from "@/components/motion/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";

const SHOWN = 6;

function formatMonth(iso: string | null) {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString("en", { month: "short", year: "numeric", timeZone: "UTC" });
}

// Server component: data is fetched on the server (cached 24 h) so no GitHub
// request or token ever reaches the browser.
export default async function GitHubActivity() {
  const data = await getGitHubData();
  const recent = data.repos.slice(0, SHOWN);
  const langs = languageCounts(data.repos);
  const withLang = langs.reduce((n, l) => n + l.count, 0);

  return (
    <section id="github" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-shell px-6 sm:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Open Source"
            title={
              <>
                Code on <span className="gradient-text">GitHub</span>
              </>
            }
            subtitle="Public repositories, straight from GitHub. Latest activity first."
          />
        </Reveal>

        <Reveal>
          <div className="mb-8 flex flex-col gap-6 border-y border-line py-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-3xl font-black text-ink">{data.repos.length}</p>
              <p className="text-[11px] font-medium uppercase tracking-wider text-muted">Public repositories</p>
            </div>
            {withLang > 0 && (
              <div className="min-w-0 flex-1 sm:max-w-md">
                <div
                  role="img"
                  aria-label={`Primary languages across repositories: ${langs.map((l) => `${l.language} ${l.count}`).join(", ")}`}
                  className="flex h-2 w-full overflow-hidden rounded-full bg-panel2"
                >
                  {langs.map((l, i) => (
                    <span
                      key={l.language}
                      style={{ width: `${(l.count / withLang) * 100}%`, opacity: 1 - i * 0.28 }}
                      className="h-full bg-purple"
                    />
                  ))}
                </div>
                <p className="mt-2 text-xs text-muted">
                  {langs.map((l) => `${l.language} (${l.count})`).join(" · ")}
                  <span className="text-muted"> — repositories with detected code</span>
                </p>
              </div>
            )}
            <a
              href={data.profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full border border-ink/30 px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple"
            >
              View profile <span aria-hidden="true">↗</span>
            </a>
          </div>
        </Reveal>

        <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {recent.map((r, i) => (
            <li key={r.name} className="list-none">
              <Reveal delay={(i % 3) * 0.08} className="h-full">
                <a
                  href={`https://github.com/121198a/${r.name}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex h-full flex-col justify-between rounded-2xl border border-line bg-panel2/70 p-6 transition-colors hover:border-purple/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple"
                >
                  <div>
                    <h3 className="break-words text-base font-bold leading-snug text-ink group-hover:text-[#b4c6fe]">
                      {r.name}
                    </h3>
                    {r.description && (
                      <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted">{r.description}</p>
                    )}
                  </div>
                  <div className="mt-5 flex items-center justify-between text-[11px] text-muted">
                    <span>{r.language ?? "—"}</span>
                    {formatMonth(r.updatedAt) && <span>Updated {formatMonth(r.updatedAt)}</span>}
                  </div>
                </a>
              </Reveal>
            </li>
          ))}
        </ul>

        <p className="mt-6 text-xs text-muted">
          {data.source === "live"
            ? "Live from the GitHub API, refreshed daily."
            : `Snapshot from ${data.asOf} — live GitHub data was unavailable when this page was built.`}
        </p>
      </div>
    </section>
  );
}
