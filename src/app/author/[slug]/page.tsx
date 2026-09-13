import type { Metadata } from "next";
import Image from "next/image";
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

export default async function AuthorPage({ params }: AuthorPageProps) {
  const { slug } = await params;
  const author = await getAuthor(slug);
  if (!author) notFound();

  const articles = await getArticlesByAuthor(slug);

  return (
    <main id="main" className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
      <p className="text-xs tracking-[0.16em] text-accent">{author.role}</p>
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
          <h1 className="font-display text-4xl">{author.name}</h1>
          <p className="mt-3 max-w-2xl leading-8 text-muted">{author.bio}</p>
        </div>
      </div>
      <div className="mt-10">
        {articles.map((article) => (
          <ArticleCard key={article.slug} article={article} variant="horizontal" />
        ))}
      </div>
    </main>
  );
}
