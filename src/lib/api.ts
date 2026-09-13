import { articles as mockArticles, authors as mockAuthors, categories as mockCategories } from "@/lib/mock-data";
import { apiUrl } from "@/lib/site";
import type { Article, Author, Category } from "@/lib/types";

const revalidate = 60;
const fetchTimeoutMs = 4_000;
const isProductionBuild =
  process.env.NEXT_PHASE === "phase-production-build" || process.env.npm_lifecycle_event === "build";

let apiUnreachable = false;

function isLocalhostApi(url: string) {
  try {
    const host = new URL(url).hostname;
    return host === "localhost" || host === "127.0.0.1";
  } catch {
    return false;
  }
}

async function fetchApi<T>(path: string): Promise<T | null> {
  if (!apiUrl || apiUnreachable) return null;
  if (isProductionBuild && isLocalhostApi(apiUrl)) return null;

  try {
    const response = await fetch(`${apiUrl}${path}`, {
      next: { revalidate, tags: ["articles"] },
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(fetchTimeoutMs),
    });

    if (!response.ok) return null;

    const payload = (await response.json()) as { data?: T } | T;
    if (payload && typeof payload === "object" && "data" in payload && payload.data !== undefined) {
      return payload.data;
    }

    return payload as T;
  } catch {
    apiUnreachable = true;
    return null;
  }
}

export async function getCategories(): Promise<Category[]> {
  return (await fetchApi<Category[]>("/categories")) ?? mockCategories;
}

export async function getCategory(slug: string): Promise<Category | undefined> {
  const fromApi = await fetchApi<Category>(`/categories/${slug}`);
  return fromApi ?? mockCategories.find((category) => category.slug === slug);
}

export async function getArticles(): Promise<Article[]> {
  const fromApi = await fetchApi<Article[]>("/articles");
  return [...(fromApi ?? mockArticles)].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
}

export async function getArticle(slug: string): Promise<Article | undefined> {
  const fromApi = await fetchApi<Article>(`/articles/${slug}`);
  return fromApi ?? mockArticles.find((article) => article.slug === slug);
}

export async function getArticlesByCategory(slug: string): Promise<Article[]> {
  const fromApi = await fetchApi<Article[]>(`/categories/${slug}/articles`);
  if (fromApi) return fromApi;
  return (await getArticles()).filter((article) => article.category.slug === slug);
}

export async function getArticlesByAuthor(slug: string): Promise<Article[]> {
  const fromApi = await fetchApi<Article[]>(`/authors/${slug}/articles`);
  if (fromApi) return fromApi;
  return (await getArticles()).filter((article) => article.author.slug === slug);
}

export async function getAuthors(): Promise<Author[]> {
  return (await fetchApi<Author[]>("/authors")) ?? mockAuthors;
}

export async function getAuthor(slug: string): Promise<Author | undefined> {
  const fromApi = await fetchApi<Author>(`/authors/${slug}`);
  return fromApi ?? mockAuthors.find((author) => author.slug === slug);
}

export async function searchArticles(query: string): Promise<Article[]> {
  const trimmed = query.trim();
  if (!trimmed) return [];

  const fromApi = await fetchApi<Article[]>(`/search?q=${encodeURIComponent(trimmed)}`);
  if (fromApi) return fromApi;

  const haystack = trimmed.toLocaleLowerCase("bn");
  return (await getArticles()).filter((article) => {
    const blob = `${article.title} ${article.excerpt} ${article.tags.join(" ")} ${article.category.name}`;
    return blob.toLocaleLowerCase("bn").includes(haystack);
  });
}

export async function getPreviewArticle(slug: string, queryString: string): Promise<Article | null> {
  if (!apiUrl) return null;

  const qs = queryString.startsWith("?") ? queryString.slice(1) : queryString;
  if (!qs) return null;

  try {
    const response = await fetch(`${apiUrl}/articles/${encodeURIComponent(slug)}/preview?${qs}`, {
      cache: "no-store",
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(fetchTimeoutMs),
    });

    if (!response.ok) return null;

    const payload = (await response.json()) as { data?: Article } | Article;
    if (payload && typeof payload === "object" && "data" in payload && payload.data) {
      return payload.data;
    }

    return payload as Article;
  } catch {
    return null;
  }
}
