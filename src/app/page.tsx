import { ArticleCard } from "@/components/article-card";
import { FeaturedStory } from "@/components/featured-story";
import { getArticles, getCategories } from "@/lib/api";
import { site } from "@/lib/site";
import Link from "next/link";

export default async function Home() {
  const [articles, categories] = await Promise.all([getArticles(), getCategories()]);
  const featured = articles.find((article) => article.featured) ?? articles[0];
  const rest = articles.filter((article) => article.slug !== featured.slug);
  const latest = rest.slice(0, 4);
  const more = rest.slice(4);

  return (
    <main id="main" className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 sm:py-12">
      <h1 className="sr-only">
        {site.name} — {site.tagline}
      </h1>
      <FeaturedStory article={featured} />

      <section className="mt-14 grid gap-10 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div>
          <div className="mb-6 flex items-end justify-between border-b border-rule pb-3">
            <h2 className="font-display text-2xl">নতুন লেখা</h2>
          </div>
          <div className="grid gap-8 sm:grid-cols-2">
            {latest.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        </div>
        <aside>
          <h2 className="border-b border-rule pb-3 font-display text-2xl">বিষয়</h2>
          <ul className="mt-4 space-y-3">
            {categories.map((category) => (
              <li key={category.slug}>
                <Link href={`/category/${category.slug}`} className="block hover:text-accent">
                  <span className="font-medium">{category.name}</span>
                  <span className="mt-1 block text-sm text-muted">{category.description}</span>
                </Link>
              </li>
            ))}
          </ul>
        </aside>
      </section>

      {more.length > 0 ? (
        <section className="mt-16">
          <h2 className="mb-2 border-b border-rule pb-3 font-display text-2xl">আরও পড়ুন</h2>
          {more.map((article) => (
            <ArticleCard key={article.slug} article={article} variant="horizontal" />
          ))}
        </section>
      ) : null}
    </main>
  );
}
