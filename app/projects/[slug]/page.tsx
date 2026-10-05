import { jsonLdString } from "@/lib/json-ld";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { profile } from "@/data/profile";
import { findProjectBySlug } from "@/data/projects";
import { caseStudies, findCaseStudy } from "@/data/case-studies";
import { siteConfig } from "@/lib/site";

type Params = { slug: string };

// Only the slugs listed in data/case-studies.ts exist; anything else is a 404.
export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return caseStudies.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const study = findCaseStudy(slug);
  const project = findProjectBySlug(slug);
  if (!study || !project) return {};
  const title = `${project.name} — ${profile.name}`;
  return {
    title,
    description: study.summary,
    alternates: { canonical: `/projects/${slug}` },
    openGraph: { title, description: study.summary, url: `${siteConfig.url}/projects/${slug}`, type: "article" },
  };
}

export default async function ProjectPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const study = findCaseStudy(slug);
  const project = findProjectBySlug(slug);
  if (!study || !project) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    name: project.name,
    description: study.summary,
    codeRepositoryUrl: study.repo,
    programmingLanguage: study.language,
    url: `${siteConfig.url}/projects/${slug}`,
    author: { "@type": "Person", name: profile.name, url: profile.github },
  };

  return (
    <main id="main" className="mx-auto w-full max-w-3xl px-6 pb-24 pt-10 sm:px-8 sm:pt-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }} />

      <nav aria-label="Breadcrumb" className="text-xs">
        <Link
          href="/#projects"
          className="inline-flex min-h-11 items-center gap-2 font-semibold text-muted transition-colors hover:text-ink"
        >
          <span aria-hidden="true">←</span> All projects
        </Link>
      </nav>

      <header className="mt-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-purple">{project.category}</p>
        <h1 className="mt-3 break-words text-[clamp(1.9rem,8vw,3.5rem)] font-black leading-[1.05] tracking-tight text-ink">
          {project.name}
        </h1>
        <p className="mt-5 text-base leading-relaxed text-muted sm:text-lg">{study.summary}</p>
        <a
          href={study.repo}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-bold text-bg transition-colors hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple"
        >
          View source on GitHub <span aria-hidden="true">↗</span>
        </a>
      </header>

      <section aria-labelledby="stack" className="mt-14 border-t border-line pt-8">
        <h2 id="stack" className="text-sm font-bold uppercase tracking-[0.16em] text-ink">Stack</h2>
        <dl className="mt-5 grid gap-x-8 gap-y-4 sm:grid-cols-2">
          {study.stack.map((g) => (
            <div key={g.label}>
              <dt className="text-[11px] font-semibold uppercase tracking-wider text-muted">{g.label}</dt>
              <dd className="mt-1.5 flex flex-wrap gap-2">
                {g.items.map((i) => (
                  <span key={i} className="rounded-full border border-line px-3 py-1 text-xs text-ink">{i}</span>
                ))}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="architecture" className="mt-12 border-t border-line pt-8">
        <h2 id="architecture" className="text-sm font-bold uppercase tracking-[0.16em] text-ink">How it is built</h2>
        <ul className="mt-5 space-y-3 text-sm leading-relaxed text-muted sm:text-base">
          {study.architecture.map((a) => (
            <li key={a} className="flex gap-3"><span aria-hidden="true" className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-purple" /><span>{a}</span></li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="highlights" className="mt-12 border-t border-line pt-8">
        <h2 id="highlights" className="text-sm font-bold uppercase tracking-[0.16em] text-ink">Technical highlights</h2>
        <ul className="mt-5 space-y-3 text-sm leading-relaxed text-muted sm:text-base">
          {study.highlights.map((h) => (
            <li key={h} className="flex gap-3"><span aria-hidden="true" className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-purple" /><span>{h}</span></li>
          ))}
        </ul>
      </section>

      {study.scope && (
        <section aria-labelledby="scope" className="mt-12 border-t border-line pt-8">
          <h2 id="scope" className="text-sm font-bold uppercase tracking-[0.16em] text-ink">Scope and status</h2>
          <ul className="mt-5 space-y-3 text-sm leading-relaxed text-muted sm:text-base">
            {study.scope.map((s) => (
              <li key={s} className="flex gap-3"><span aria-hidden="true" className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-muted" /><span>{s}</span></li>
            ))}
          </ul>
        </section>
      )}

      <p className="mt-14 border-t border-line pt-6 text-xs text-muted">
        Details on this page were taken from the project&rsquo;s repository source.
      </p>
    </main>
  );
}
