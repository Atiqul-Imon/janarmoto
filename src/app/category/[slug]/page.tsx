import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ArticleCard } from "@/components/article-card";
import { JsonLd } from "@/components/json-ld";
import { getArticlesByCategory, getCategories, getCategory } from "@/lib/api";
import { absoluteUrl, breadcrumbJsonLd, itemListJsonLd, listingMetadata } from "@/lib/seo";

type CategoryPageProps = PageProps<"/category/[slug]">;

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({ params, searchParams }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = Math.max(1, Number((await searchParams).page ?? 1) || 1);
  const category = await getCategory(slug);
  if (!category) return { title: "বিষয় পাওয়া যায়নি", robots: { index: false, follow: true } };

  return listingMetadata({
    title: category.metaTitle ?? category.name,
    description: category.metaDescription ?? category.description,
    path: `/category/${category.slug}`,
    page,
  });
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = await params;
  const query = await searchParams;
  const page = Math.max(1, Number(query.page ?? 1) || 1);
  const category = await getCategory(slug);
  if (!category) notFound();

  const feed = await getArticlesByCategory(slug, page);

  return (
    <main id="main" className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: category.name,
          description: category.description,
          url: absoluteUrl(`/category/${category.slug}`),
          inLanguage: "bn-BD",
        }}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "প্রচ্ছদ", path: "/" },
          { name: category.name, path: `/category/${category.slug}` },
        ])}
      />
      {feed.data.length > 0 ? (
        <JsonLd
          data={itemListJsonLd(
            feed.data.map((article) => ({
              name: article.title,
              path: `/article/${article.slug}`,
            })),
            `/category/${category.slug}`,
          )}
        />
      ) : null}
      <p className="text-[0.8125rem] font-medium text-muted">বিষয়</p>
      <h1 className="mt-2 font-display text-[2.35rem] font-semibold leading-[1.28] tracking-[-0.02em] sm:text-[2.75rem]">
        {category.name}
      </h1>
      <p className="mt-3 max-w-2xl text-[1.125rem] leading-8 text-muted">{category.description}</p>
      <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {feed.data.map((article) => (
          <ArticleCard key={article.slug} article={article} />
        ))}
      </div>
      {feed.meta.last_page > 1 ? (
        <nav className="mt-10 flex gap-4 text-sm text-muted" aria-label="পাতা">
          {page > 1 ? <Link href={`/category/${slug}?page=${page - 1}`}>আগের পাতা</Link> : null}
          {page < feed.meta.last_page ? (
            <Link href={`/category/${slug}?page=${page + 1}`}>পরের পাতা</Link>
          ) : null}
        </nav>
      ) : null}
    </main>
  );
}
