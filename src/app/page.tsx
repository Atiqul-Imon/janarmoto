import { ArticleCard } from "@/components/article-card";
import { FeaturedStory } from "@/components/featured-story";
import { getArticles, getCategories } from "@/lib/api";
import { site } from "@/lib/site";
import Link from "next/link";

export const revalidate = 60;

export default async function Home() {
  const [articles, categories] = await Promise.all([getArticles(), getCategories()]);
  const featured = articles.find((article) => article.featured) ?? articles[0];
  const rest = featured ? articles.filter((article) => article.slug !== featured.slug) : [];
  const latest = rest.slice(0, 4);
  const more = rest.slice(4);

  return (
    <main id="main" className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 sm:py-12">
      <h1 className="sr-only">
        {site.name} — {site.tagline}
      </h1>
      {featured ? (
        <FeaturedStory article={featured} />
      ) : (
        <section className="max-w-2xl py-12">
          <p className="text-xs tracking-[0.18em] text-accent">জানার মতো</p>
          <h2 className="mt-3 font-display text-[2rem] font-semibold leading-[1.28] tracking-[-0.02em] sm:text-[2.5rem]">
            এখনো কোনো লেখা প্রকাশ হয়নি
          </h2>
          <p className="mt-4 text-[1.125rem] leading-8 text-muted">নতুন লেখা এলে এখানে দেখা যাবে।</p>
        </section>
      )}

      <section className="mt-14 grid gap-10 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div>
          <div className="mb-6 flex items-end justify-between border-b border-rule pb-3">
          <h2 className="font-display text-[1.55rem] font-semibold">নতুন লেখা</h2>
          </div>
          <div className="grid gap-8 sm:grid-cols-2">
            {latest.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        </div>
        <aside>
          <h2 className="border-b border-rule pb-3 font-display text-[1.55rem] font-semibold">বিষয়</h2>
          <ul className="mt-4 space-y-4">
            {categories.map((category) => (
              <li key={category.slug}>
                <Link href={`/category/${category.slug}`} className="block hover:text-accent">
                  <span className="font-medium">{category.name}</span>
                  <span className="mt-1 block text-[0.975rem] leading-7 text-muted">{category.description}</span>
                </Link>
              </li>
            ))}
          </ul>
        </aside>
      </section>

      {more.length > 0 ? (
        <section className="mt-16">
          <h2 className="mb-2 border-b border-rule pb-3 font-display text-[1.55rem] font-semibold">আরও পড়ুন</h2>
          {more.map((article) => (
            <ArticleCard key={article.slug} article={article} variant="horizontal" />
          ))}
        </section>
      ) : null}
    </main>
  );
}
