import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";
import { caseStudySlugs } from "@/data/case-study-slugs";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteConfig.url,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    ...caseStudySlugs.map((slug) => ({
      url: `${siteConfig.url}/projects/${slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
