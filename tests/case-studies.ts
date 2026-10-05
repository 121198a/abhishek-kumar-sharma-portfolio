// Content guard for data/case-studies.ts — run with: npm run test:content
// Fails if a case study references a missing project, a non-GitHub repo URL,
// empty sections, or any claim that has not been verified against source code.
import { caseStudies } from "../data/case-studies";
import { projects } from "../data/projects";
import { caseStudySlugs } from "../data/case-study-slugs";

const BLOCKED = [
  /spring\s*boot/i, /\.net\b/i, /\baws\b/i, /lambda/i, /\bs3\b/i, /infopulse/i,
  /cocole/i, /\bpublished\b/i, /\boscilloscope\b/i, /testimonial/i, /\busers? (?:per|a) /i,
];

let failures = 0;
const fail = (msg: string) => { failures++; console.error("FAIL:", msg); };

const a = [...caseStudySlugs].sort().join(",");
const b = caseStudies.map((c) => c.slug).sort().join(",");
if (a !== b) fail(`data/case-study-slugs.ts (${a}) and data/case-studies.ts (${b}) disagree`);

const seen = new Set<string>();
for (const c of caseStudies) {
  if (seen.has(c.slug)) fail(`duplicate slug ${c.slug}`);
  seen.add(c.slug);
  const project = projects.find((p) => p.slug === c.slug);
  if (!project) fail(`${c.slug}: no matching project in data/projects.ts`);
  if (!/^https:\/\/github\.com\/121198a\/[A-Za-z0-9._-]+$/.test(c.repo)) fail(`${c.slug}: repo URL must be a 121198a GitHub repo`);
  if (!c.summary.trim()) fail(`${c.slug}: empty summary`);
  for (const [name, arr] of [["architecture", c.architecture], ["highlights", c.highlights], ["stack", c.stack]] as const) {
    if (!arr.length) fail(`${c.slug}: empty ${name}`);
  }
  const text = JSON.stringify(c);
  for (const re of BLOCKED) if (re.test(text)) fail(`${c.slug}: contains unverified claim matching ${re}`);
}

if (failures) { console.error(`\n${failures} problem(s)`); process.exit(1); }
console.log(`Case-study content guard: ${caseStudies.length} studies OK`);
