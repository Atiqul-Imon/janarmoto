import type { Metadata } from "next";
import Link from "next/link";

import { ArticleCard } from "@/components/article-card";
import { FeaturedStory } from "@/components/featured-story";
import { JsonLd } from "@/components/json-ld";
import { getArticleFeed, getCategories, getFeaturedArticle } from "@/lib/api";
import { itemListJsonLd } from "@/lib/seo";
import { site } from "@/lib/site";
import type { Article } from "@/lib/types";

export const revalidate = 60;

export const metadata: Metadata = {
  title: {
    absolute: `${site.name} | ${site.tagline}`,
  },
  description: site.description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    title: `${site.name} | ${site.tagline}`,
    description: site.description,
  },
};

export default async function Home() {
  const [featured, feed, categories] = await Promise.all([
    getFeaturedArticle(),
    getArticleFeed({ perPage: 18, excludeFeatured: true }),
    getCategories(),
  ]);
  const rest = feed.data.filter((article) => article.slug !== featured?.slug);
  const overlay = rest[0] ?? null;
  const belowLead = rest.slice(overlay ? 1 : 0, overlay ? 3 : 2);
  const rail = rest.slice(overlay ? 3 : 2, overlay ? 9 : 8);
  const more = rest.slice(overlay ? 9 : 8);
  const listArticles: Article[] = [featured, overlay, ...belowLead, ...rail].filter(
    (article): article is Article => article != null,
  );

  return (
    <main id="main" className="mx-auto w-full max-w-7xl flex-1 px-4 py-5 sm:px-6 sm:py-7">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: site.name,
          description: site.description,
          url: site.url,
          inLanguage: "bn-BD",
          isPartOf: { "@id": `${site.url}/#website` },
        }}
      />
      {listArticles.length > 0 ? (
        <JsonLd
          data={itemListJsonLd(
            listArticles.map((article) => ({
              name: article.title,
              path: `/article/${article.slug}`,
            })),
            "/",
          )}
        />
      ) : null}
      <h1 className="sr-only">
        {site.name} — {site.tagline}
      </h1>

      {featured ? (
        <section className="grid gap-6 lg:grid-cols-[minmax(0,17rem)_minmax(0,1fr)_minmax(0,19rem)] lg:items-start">
          <div className="order-2 lg:order-1">
            {overlay ? <ArticleCard article={overlay} variant="overlay" /> : null}
          </div>

          <div className="order-1 lg:order-2">
            <FeaturedStory article={featured} />
            {belowLead.length > 0 ? (
              <div className="mt-6 grid gap-5 border-t border-rule pt-5 sm:grid-cols-2">
                {belowLead.map((article) => (
                  <ArticleCard key={article.slug} article={article} />
                ))}
              </div>
            ) : null}
          </div>

          <aside className="order-3 border-t border-rule pt-4 lg:border-t-0 lg:pt-0">
            <h2 className="mb-1 border-b border-rule pb-2 font-display text-lg font-bold">সর্বশেষ</h2>
            {rail.map((article) => (
              <ArticleCard key={article.slug} article={article} variant="rail" />
            ))}
          </aside>
        </section>
      ) : (
        <section className="max-w-2xl py-12">
          <p className="text-xs tracking-[0.18em] text-accent">জানার মতো</p>
          <h2 className="mt-3 font-display text-[2rem] font-semibold leading-[1.28] tracking-[-0.02em] sm:text-[2.5rem]">
            এখনো কোনো লেখা প্রকাশ হয়নি
          </h2>
          <p className="mt-4 text-[1.125rem] leading-8 text-muted">নতুন লেখা এলে এখানে দেখা যাবে।</p>
        </section>
      )}

      {categories.length > 0 ? (
        <section className="mt-10 border-t border-rule pt-6">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/category/${category.slug}`}
                className="border border-rule px-3 py-1.5 text-sm text-ink/80 hover:border-accent hover:text-accent"
              >
                {category.name}
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      {more.length > 0 ? (
        <section className="mt-8">
          <h2 className="mb-4 border-b border-rule pb-2 font-display text-xl font-bold">আরও পড়ুন</h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {more.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
