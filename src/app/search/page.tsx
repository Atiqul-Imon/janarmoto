import type { Metadata } from "next";

import { ArticleCard } from "@/components/article-card";
import { SearchForm } from "@/components/search-form";
import { searchArticles } from "@/lib/api";

type SearchPageProps = PageProps<"/search">;

export const metadata: Metadata = {
  title: "খুঁজুন",
  robots: { index: false, follow: true },
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const query = typeof q === "string" ? q : "";
  const results = query ? await searchArticles(query) : [];

  return (
    <main id="main" className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:px-6">
      <h1 className="font-display text-4xl">খুঁজুন</h1>
      <div className="mt-6">
        <SearchForm defaultValue={query} className="max-w-none" />
      </div>
      {query ? (
        <p className="mt-6 text-sm text-muted">
          “{query}” বিষয়ে {results.length.toLocaleString("bn-BD")}টি ফলাফল
        </p>
      ) : (
        <p className="mt-6 text-sm text-muted">শিরোনাম, বিষয় বা ট্যাগ দিয়ে খুঁজুন।</p>
      )}
      <div className="mt-6">
        {results.map((article) => (
          <ArticleCard key={article.slug} article={article} variant="horizontal" />
        ))}
      </div>
    </main>
  );
}
