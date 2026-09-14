import type { Metadata } from "next";
import Link from "next/link";

import { ArticleCard } from "@/components/article-card";
import { SearchForm } from "@/components/search-form";
import { searchArticles } from "@/lib/api";

type SearchPageProps = PageProps<"/search">;

export const metadata: Metadata = {
  title: "খুঁজুন",
  robots: { index: false, follow: true },
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = typeof params.q === "string" ? params.q : "";
  const page = Math.max(1, Number(params.page ?? 1) || 1);
  const results = query ? await searchArticles(query, page) : null;

  return (
    <main id="main" className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:px-6">
      <h1 className="font-display text-[2.35rem] font-semibold leading-[1.28] tracking-[-0.02em] sm:text-[2.75rem]">
        খুঁজুন
      </h1>
      <div className="mt-6">
        <SearchForm defaultValue={query} className="max-w-none" />
      </div>
      {query && results ? (
        <p className="mt-6 text-sm text-muted">
          “{query}” বিষয়ে {results.meta.total.toLocaleString("bn-BD")}টি ফলাফল
        </p>
      ) : (
        <p className="mt-6 text-sm text-muted">শিরোনাম, বিষয় বা ট্যাগ দিয়ে খুঁজুন।</p>
      )}
      <div className="mt-6">
        {results?.data.map((article) => (
          <ArticleCard key={article.slug} article={article} variant="horizontal" />
        ))}
      </div>
      {results && results.meta.last_page > 1 ? (
        <nav className="mt-10 flex gap-4 text-sm text-muted" aria-label="পাতা">
          {page > 1 ? (
            <Link href={`/search?q=${encodeURIComponent(query)}&page=${page - 1}`}>আগের পাতা</Link>
          ) : null}
          {page < results.meta.last_page ? (
            <Link href={`/search?q=${encodeURIComponent(query)}&page=${page + 1}`}>পরের পাতা</Link>
          ) : null}
        </nav>
      ) : null}
    </main>
  );
}
