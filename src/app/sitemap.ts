import type { MetadataRoute } from "next";

import { getAllArticlesForIndex, getCategories } from "@/lib/api";
import { site } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [articles, categories] = await Promise.all([getAllArticlesForIndex(), getCategories()]);
  const lastModified = new Date();

  return [
    { url: site.url, lastModified, changeFrequency: "daily", priority: 1 },
    { url: `${site.url}/about`, lastModified, changeFrequency: "monthly", priority: 0.5 },
    { url: `${site.url}/contact`, lastModified, changeFrequency: "monthly", priority: 0.4 },
    ...categories.map((category) => ({
      url: `${site.url}/category/${category.slug}`,
      lastModified,
      changeFrequency: "daily" as const,
      priority: 0.7,
    })),
    ...articles.map((article) => ({
      url: `${site.url}/article/${article.slug}`,
      lastModified: new Date(article.updatedAt),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
