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
      <article className="mt-6">
        <header className="max-w-3xl">
          <p className="text-xs tracking-[0.16em] text-accent">{article.category.name}</p>
          <h1 className="mt-3 font-display text-3xl leading-tight sm:text-5xl">{article.title}</h1>
          <p className="mt-4 text-lg leading-8 text-muted">{article.excerpt}</p>
          <p className="mt-5 text-sm text-muted">
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
        <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-lg">
          <Image
            src={article.coverImage}
            alt={article.coverAlt}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 1152px"
            className="object-cover"
          />
        </div>
        <div className="mt-10">
          <ArticleBody html={article.html} blocks={article.blocks} />
        </div>
      </article>
    </main>
  );
}
