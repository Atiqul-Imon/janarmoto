import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ArticleBody } from "@/components/article-body";
import { ArticleCard } from "@/components/article-card";
import { JsonLd } from "@/components/json-ld";
import { ShareLinks } from "@/components/share-links";
import { getArticle, getArticles } from "@/lib/api";
import { formatDate, formatReadingTime } from "@/lib/format";
import { site } from "@/lib/site";

type ArticlePageProps = PageProps<"/article/[slug]">;

export async function generateStaticParams() {
  const articles = await getArticles();
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) return { title: "লেখা পাওয়া যায়নি" };

  const url = `/article/${article.slug}`;
  const title = article.metaTitle ?? article.title;
  const description = article.metaDescription ?? article.excerpt;
  const image = article.ogImage ?? article.coverImage;
  const indexable = article.robotsIndex !== false;

  return {
    title,
    description,
    authors: [{ name: article.author.name }],
    keywords: article.tags,
    robots: {
      index: indexable,
      follow: article.robotsFollow !== false,
    },
    alternates: { canonical: article.canonicalUrl ?? url },
    openGraph: {
      type: "article",
      locale: site.locale,
      url,
      title: article.ogTitle ?? title,
      description: article.ogDescription ?? description,
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      authors: [article.author.name],
      section: article.category.name,
      tags: article.tags,
      images: [{ url: image, alt: article.coverAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title: article.ogTitle ?? title,
      description: article.ogDescription ?? description,
      images: [image],
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) notFound();

  const related = (await getArticles())
    .filter((item) => item.slug !== article.slug && item.category.slug === article.category.slug)
    .slice(0, 3);

  const url = `${site.url}/article/${article.slug}`;

  return (
    <main id="main" className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 sm:py-12">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "NewsArticle",
          headline: article.title,
          description: article.excerpt,
          image: [article.coverImage],
          datePublished: article.publishedAt,
          dateModified: article.updatedAt,
          inLanguage: "bn-BD",
          mainEntityOfPage: url,
          author: {
            "@type": "Person",
            name: article.author.name,
            url: `${site.url}/author/${article.author.slug}`,
          },
          publisher: {
            "@type": "NewsMediaOrganization",
            name: site.name,
            url: site.url,
          },
          articleSection: article.category.name,
          keywords: article.tags.join(", "),
        }}
      />
      <nav className="mx-auto max-w-[40.5rem] text-[0.9375rem] text-muted" aria-label="ব্রেডক্রাম্ব">
        <Link href="/">প্রচ্ছদ</Link>
        <span className="mx-2 text-rule">/</span>
        <Link href={`/category/${article.category.slug}`}>{article.category.name}</Link>
      </nav>
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
            {" · "}
            <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
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
        <footer className="mx-auto mt-12 max-w-[40.5rem] border-t border-rule pt-7">
          <ShareLinks title={article.title} path={`/article/${article.slug}`} />
          <ul className="mt-4 flex flex-wrap gap-2">
            {article.tags.map((tag) => (
              <li key={tag} className="rounded-full border border-rule px-3 py-1 text-xs text-muted">
                {tag}
              </li>
            ))}
          </ul>
        </footer>
      </article>
      {related.length > 0 ? (
        <section className="mt-16">
          <h2 className="mb-6 font-display text-[1.65rem] font-semibold">এই বিষয়ে আরও</h2>
          <div className="grid gap-8 sm:grid-cols-3">
            {related.map((item) => (
              <ArticleCard key={item.slug} article={item} />
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
