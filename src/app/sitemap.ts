import type { MetadataRoute } from "next";

import { getAllArticlesForIndex, getAuthors, getCategories } from "@/lib/api";
import { site } from "@/lib/site";

export const revalidate = 60;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [articles, categories, authors] = await Promise.all([
    getAllArticlesForIndex(),
    getCategories(),
    getAuthors(),
  ]);

  const indexable = articles.filter((article) => article.robotsIndex !== false);
  const tags = [...new Set(indexable.flatMap((article) => article.tags ?? []))];
  const latestArticle = indexable[0];
  const lastModified = latestArticle ? new Date(latestArticle.updatedAt) : new Date();

  return [
    { url: site.url, lastModified, changeFrequency: "hourly", priority: 1 },
    { url: `${site.url}/about`, lastModified, changeFrequency: "monthly", priority: 0.4 },
    { url: `${site.url}/contact`, lastModified, changeFrequency: "monthly", priority: 0.3 },
    ...categories.map((category) => ({
      url: `${site.url}/category/${category.slug}`,
      lastModified,
      changeFrequency: "daily" as const,
      priority: 0.7,
    })),
    ...authors.map((author) => ({
      url: `${site.url}/author/${author.slug}`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.5,
    })),
    ...tags.map((tag) => ({
      url: `${site.url}/tag/${encodeURIComponent(tag)}`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.5,
    })),
    ...indexable.map((article) => ({
      url: `${site.url}/article/${article.slug}`,
      lastModified: new Date(article.updatedAt),
      changeFrequency: "weekly" as const,
      priority: article.featured ? 0.9 : 0.8,
      images: article.coverImage ? [article.coverImage] : undefined,
    })),
  ];
}
