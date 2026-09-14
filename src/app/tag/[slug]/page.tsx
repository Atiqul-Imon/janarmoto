import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ArticleCard } from "@/components/article-card";
import { JsonLd } from "@/components/json-ld";
import { getAllArticlesForIndex, getArticlesByTag } from "@/lib/api";
import { absoluteUrl, breadcrumbJsonLd, itemListJsonLd, listingMetadata } from "@/lib/seo";

type TagPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateStaticParams() {
  const articles = await getAllArticlesForIndex();
  const tags = new Set<string>();
  for (const article of articles) {
    for (const tag of article.tags ?? []) tags.add(tag);
  }
  return [...tags].map((slug) => ({ slug }));
}

export async function generateMetadata({ params, searchParams }: TagPageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = Math.max(1, Number((await searchParams).page ?? 1) || 1);
  const tag = decodeURIComponent(slug);
  const feed = await getArticlesByTag(tag, 1);
  if (feed.meta.total === 0) return { title: "ট্যাগ পাওয়া যায়নি", robots: { index: false, follow: true } };

  return listingMetadata({
    title: tag,
    description: `“${tag}” বিষয়ে জানার মতো-এর লেখা।`,
    path: `/tag/${tag}`,
    page,
  });
}

export default async function TagPage({ params, searchParams }: TagPageProps) {
  const { slug } = await params;
  const query = await searchParams;
  const page = Math.max(1, Number(query.page ?? 1) || 1);
  const tag = decodeURIComponent(slug);
  const feed = await getArticlesByTag(tag, page);
  if (feed.meta.total === 0) notFound();

  const path = `/tag/${tag}`;

  return (
    <main id="main" className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: tag,
          url: absoluteUrl(path),
          inLanguage: "bn-BD",
        }}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "প্রচ্ছদ", path: "/" },
          { name: tag, path },
        ])}
      />
      <JsonLd
        data={itemListJsonLd(
          feed.data.map((article) => ({
            name: article.title,
            path: `/article/${article.slug}`,
          })),
          path,
        )}
      />
      <p className="text-[0.8125rem] font-medium text-muted">ট্যাগ</p>
      <h1 className="mt-2 font-display text-[2.35rem] font-semibold leading-[1.28] tracking-[-0.02em] sm:text-[2.75rem]">
        {tag}
      </h1>
      <p className="mt-3 max-w-2xl text-[1.125rem] leading-8 text-muted">
        এই বিষয়ে {feed.meta.total.toLocaleString("bn-BD")}টি লেখা।
      </p>
      <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {feed.data.map((article) => (
          <ArticleCard key={article.slug} article={article} />
        ))}
      </div>
      {feed.meta.last_page > 1 ? (
        <nav className="mt-10 flex gap-4 text-sm text-muted" aria-label="পাতা">
          {page > 1 ? <Link href={`${path}?page=${page - 1}`}>আগের পাতা</Link> : null}
          {page < feed.meta.last_page ? <Link href={`${path}?page=${page + 1}`}>পরের পাতা</Link> : null}
        </nav>
      ) : null}
    </main>
  );
}
