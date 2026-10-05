// Slugs that have a detail page. Kept separate and tiny so client components
// can import it without pulling the full case-study text into their bundle.
// `npm run test:content` fails if this list and data/case-studies.ts disagree.
export const caseStudySlugs: readonly string[] = [
  "bank-management-system",
  "ventureflow-web",
  "unboundx-admin-dashboard",
  "noc-monitoring-lab",
  "fir-management-system",
  "sharma-kitchen",
];
