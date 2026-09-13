import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ArticleBody } from "@/components/article-body";
import { getPreviewArticle } from "@/lib/api";
import { formatDate, formatReadingTime } from "@/lib/format";

type PreviewPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function queryString(searchParams: Record<string, string | string[] | undefined>) {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(searchParams)) {
    if (typeof value === "string") {
      params.set(key, value);
    } else if (Array.isArray(value) && value[0]) {
      params.set(key, value[0]);
    }
  }

  return params.toString();
}

export const metadata: Metadata = {
  title: "খসড়া প্রিভিউ",
  robots: { index: false, follow: false },
};

export default async function PreviewArticlePage({ params, searchParams }: PreviewPageProps) {
  const { slug } = await params;
  const query = queryString(await searchParams);
  const article = await getPreviewArticle(slug, query);
  if (!article) notFound();

  return (
    <main id="main" className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 sm:py-12">
      <div className="rounded-lg border border-accent/30 bg-accent/10 px-4 py-3 text-sm">
        এটি একটি খসড়া প্রিভিউ। পাঠকেরা এটি দেখতে পাবেন না যতক্ষণ না আপনি প্রকাশ করেন।
      </div>
      <article className="mt-7">
        <header className="mx-auto max-w-[40.5rem]">
          <p className="text-[0.8125rem] font-medium text-accent">{article.category.name}</p>
          <h1 className="mt-3 font-display text-[2rem] font-semibold leading-[1.28] tracking-[-0.02em] sm:text-[2.75rem]">
            {article.title}
          </h1>
          <p className="mt-5 text-[1.125rem] leading-8 text-muted sm:text-[1.2rem] sm:leading-9">{article.excerpt}</p>
          <p className="mt-6 text-[0.9375rem] text-muted">
            <Link href={`/author/${article.author.slug}`} className="hover:text-ink">
              {article.author.name}
            </Link>
            {article.publishedAt ? (
              <>
                {" · "}
                <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
              </>
            ) : null}
            {" · "}
            {formatReadingTime(article.readingMinutes)}
          </p>
        </header>
        <div className="relative mx-auto mt-9 aspect-[16/9] max-w-3xl overflow-hidden rounded-lg">
          <Image
            src={article.coverImage}
            alt={article.coverAlt}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 1152px"
            className="object-cover"
          />
        </div>
        <div className="mt-12">
          <ArticleBody html={article.html} blocks={article.blocks} />
        </div>
      </article>
    </main>
  );
}
