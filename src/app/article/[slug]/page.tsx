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
      <nav className="text-sm text-muted" aria-label="ব্রেডক্রাম্ব">
        <Link href="/">প্রচ্ছদ</Link>
        <span className="mx-2">/</span>
        <Link href={`/category/${article.category.slug}`}>{article.category.name}</Link>
      </nav>
      <article className="mt-6">
        <header className="max-w-3xl">
          <p className="text-xs tracking-[0.16em] text-accent">{article.category.name}</p>
          <h1 className="mt-3 font-display text-3xl leading-tight sm:text-5xl">{article.title}</h1>
          <p className="mt-4 text-lg leading-8 text-muted">{article.excerpt}</p>
          <p className="mt-5 text-sm text-muted">
            <Link href={`/author/${article.author.slug}`} className="hover:text-ink">
              {article.author.name}
            </Link>
            {" · "}
            <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
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
        <footer className="mt-10 max-w-2xl border-t border-rule pt-6">
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
          <h2 className="mb-6 font-display text-2xl">এই বিষয়ে আরও</h2>
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
