import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ArticleCard } from "@/components/article-card";
import { getArticlesByAuthor, getAuthor, getAuthors } from "@/lib/api";

export async function generateStaticParams() {
  const authors = await getAuthors();
  return authors.map((author) => ({ slug: author.slug }));
}

type AuthorPageProps = PageProps<"/author/[slug]">;

export async function generateMetadata({ params }: AuthorPageProps): Promise<Metadata> {
  const { slug } = await params;
  const author = await getAuthor(slug);
  if (!author) return { title: "লেখক পাওয়া যায়নি" };

  return {
    title: author.name,
    description: author.bio,
    alternates: { canonical: `/author/${author.slug}` },
  };
}

export default async function AuthorPage({ params, searchParams }: AuthorPageProps) {
  const { slug } = await params;
  const query = await searchParams;
  const page = Math.max(1, Number(query.page ?? 1) || 1);
  const author = await getAuthor(slug);
  if (!author) notFound();

  const feed = await getArticlesByAuthor(slug, page);

  return (
    <main id="main" className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
      <p className="text-[0.8125rem] font-medium text-accent">{author.role}</p>
      <div className="mt-3 flex items-start gap-4">
        {author.photo ? (
          <Image
            src={author.photo}
            alt={author.name}
            width={88}
            height={88}
            className="size-[88px] rounded-full object-cover"
          />
        ) : null}
        <div>
          <h1 className="font-display text-[2.35rem] font-semibold leading-[1.28] tracking-[-0.02em] sm:text-[2.75rem]">
            {author.name}
          </h1>
          <p className="mt-3 max-w-2xl text-[1.125rem] leading-8 text-muted">{author.bio}</p>
        </div>
      </div>
      <div className="mt-10">
        {feed.data.map((article) => (
          <ArticleCard key={article.slug} article={article} variant="horizontal" />
        ))}
      </div>
      {feed.meta.last_page > 1 ? (
        <nav className="mt-10 flex gap-4 text-sm text-muted" aria-label="পাতা">
          {page > 1 ? <Link href={`/author/${slug}?page=${page - 1}`}>আগের পাতা</Link> : null}
          {page < feed.meta.last_page ? (
            <Link href={`/author/${slug}?page=${page + 1}`}>পরের পাতা</Link>
          ) : null}
        </nav>
      ) : null}
    </main>
  );
}
