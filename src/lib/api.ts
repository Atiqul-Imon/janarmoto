import { articles as mockArticles, authors as mockAuthors, categories as mockCategories } from "@/lib/mock-data";
import { apiUrl } from "@/lib/site";
import type { Article, Author, Category } from "@/lib/types";

const revalidate = 60;
const fetchTimeoutMs = 4_000;
const isProductionBuild =
  process.env.NEXT_PHASE === "phase-production-build" || process.env.npm_lifecycle_event === "build";

export type ArticleQuery = {
  page?: number;
  perPage?: number;
  category?: string;
  author?: string;
  tag?: string;
  featured?: boolean;
  excludeFeatured?: boolean;
};

export type PaginatedArticles = {
  data: Article[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
};

function isLocalhostApi(url: string) {
  try {
    const host = new URL(url).hostname;
    return host === "localhost" || host === "127.0.0.1";
  } catch {
    return false;
  }
}

function allowMockFallback() {
  return !apiUrl || isLocalhostApi(apiUrl);
}

function articleQuery(params: ArticleQuery = {}) {
  const search = new URLSearchParams();
  if (params.page) search.set("page", String(params.page));
  if (params.perPage) search.set("per_page", String(params.perPage));
  if (params.category) search.set("category", params.category);
  if (params.author) search.set("author", params.author);
  if (params.tag) search.set("tag", params.tag);
  if (params.featured) search.set("featured", "1");
  if (params.excludeFeatured) search.set("exclude_featured", "1");
  const qs = search.toString();
  return qs ? `?${qs}` : "";
}

async function fetchApi<T>(path: string): Promise<T | null> {
  if (!apiUrl) return null;
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
    return null;
  }
}

async function fetchPaginatedArticles(path: string): Promise<PaginatedArticles | null> {
  if (!apiUrl) return null;
  if (isProductionBuild && isLocalhostApi(apiUrl)) return null;

  try {
    const response = await fetch(`${apiUrl}${path}`, {
      next: { revalidate, tags: ["articles"] },
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(fetchTimeoutMs),
    });

    if (!response.ok) return null;

    const payload = (await response.json()) as {
      data?: Article[];
      meta?: PaginatedArticles["meta"];
    };

    if (!payload.data) return null;

    return {
      data: payload.data,
      meta: payload.meta ?? {
        current_page: 1,
        last_page: 1,
        per_page: payload.data.length,
        total: payload.data.length,
      },
    };
  } catch {
    return null;
  }
}

function sortArticles(articles: Article[]) {
  return [...articles].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
}

function paginateMock(articles: Article[], page = 1, perPage = 20): PaginatedArticles {
  const start = (page - 1) * perPage;
  const data = articles.slice(start, start + perPage);
  return {
    data,
    meta: {
      current_page: page,
      last_page: Math.max(1, Math.ceil(articles.length / perPage)),
      per_page: perPage,
      total: articles.length,
    },
  };
}

export async function getCategories(): Promise<Category[]> {
  const fromApi = await fetchApi<Category[]>("/categories");
  if (fromApi !== null) return fromApi;
  return allowMockFallback() ? mockCategories : [];
}

export async function getCategory(slug: string): Promise<Category | undefined> {
  const fromApi = await fetchApi<Category>(`/categories/${slug}`);
  if (fromApi) return fromApi;
  if (!allowMockFallback()) return undefined;
  return mockCategories.find((category) => category.slug === slug);
}

export async function getArticleFeed(query: ArticleQuery = {}): Promise<PaginatedArticles> {
  const fromApi = await fetchPaginatedArticles(`/articles${articleQuery(query)}`);
  if (fromApi) return fromApi;

  let pool = allowMockFallback() ? sortArticles(mockArticles) : [];
  if (query.category) pool = pool.filter((article) => article.category.slug === query.category);
  if (query.author) pool = pool.filter((article) => article.author.slug === query.author);
  if (query.featured) pool = pool.filter((article) => article.featured);
  if (query.excludeFeatured) pool = pool.filter((article) => !article.featured);

  return paginateMock(pool, query.page ?? 1, query.perPage ?? 20);
}

export async function getArticles(query: ArticleQuery = {}): Promise<Article[]> {
  const feed = await getArticleFeed(query);
  return feed.data;
}

export async function getFeaturedArticle(): Promise<Article | undefined> {
  const fromApi = await fetchApi<Article>("/articles/featured");
  if (fromApi) return fromApi;
  const feed = await getArticleFeed({ perPage: 1 });
  return feed.data[0];
}

export async function getArticle(slug: string): Promise<Article | undefined> {
  const fromApi = await fetchApi<Article>(`/articles/${slug}`);
  if (fromApi) return fromApi;
  if (!allowMockFallback()) return undefined;
  return mockArticles.find((article) => article.slug === slug);
}

export async function getRelatedArticles(slug: string): Promise<Article[]> {
  const fromApi = await fetchApi<Article[]>(`/articles/${slug}/related`);
  if (fromApi !== null) return fromApi;
  const article = await getArticle(slug);
  if (!article) return [];
  return (await getArticles({ category: article.category.slug, perPage: 8 })).filter(
    (item) => item.slug !== slug,
  );
}

export async function getArticlesByCategory(slug: string, page = 1): Promise<PaginatedArticles> {
  const fromApi = await fetchPaginatedArticles(
    `/categories/${slug}/articles${articleQuery({ page, perPage: 24 })}`,
  );
  if (fromApi) return fromApi;
  return getArticleFeed({ category: slug, page, perPage: 24 });
}

export async function getArticlesByAuthor(slug: string, page = 1): Promise<PaginatedArticles> {
  const fromApi = await fetchPaginatedArticles(
    `/authors/${slug}/articles${articleQuery({ page, perPage: 24 })}`,
  );
  if (fromApi) return fromApi;
  return getArticleFeed({ author: slug, page, perPage: 24 });
}

export async function getAuthors(): Promise<Author[]> {
  const fromApi = await fetchApi<Author[]>("/authors");
  if (fromApi !== null) return fromApi;
  return allowMockFallback() ? mockAuthors : [];
}

export async function getAuthor(slug: string): Promise<Author | undefined> {
  const fromApi = await fetchApi<Author>(`/authors/${slug}`);
  if (fromApi) return fromApi;
  if (!allowMockFallback()) return undefined;
  return mockAuthors.find((author) => author.slug === slug);
}

export async function searchArticles(query: string, page = 1): Promise<PaginatedArticles> {
  const trimmed = query.trim();
  if (!trimmed) {
    return paginateMock([], 1, 20);
  }

  const fromApi = await fetchPaginatedArticles(
    `/search?q=${encodeURIComponent(trimmed)}&page=${page}&per_page=20`,
  );
  if (fromApi) return fromApi;

  const haystack = trimmed.toLocaleLowerCase("bn");
  const matches = (await getArticles({ perPage: 50 })).filter((article) => {
    const blob = `${article.title} ${article.excerpt} ${article.tags.join(" ")} ${article.category.name}`;
    return blob.toLocaleLowerCase("bn").includes(haystack);
  });

  return paginateMock(matches, page, 20);
}

export async function getAllArticlesForIndex(): Promise<Article[]> {
  const items: Article[] = [];

  for (let page = 1; page <= 40; page += 1) {
    const feed = await getArticleFeed({ page, perPage: 50 });
    items.push(...feed.data);
    if (page >= feed.meta.last_page) break;
  }

  return items;
}

export async function getArticleSlugs(): Promise<string[]> {
  return (await getAllArticlesForIndex()).map((article) => article.slug);
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
