import Image from "next/image";
import Link from "next/link";

import { formatDate, formatReadingTime } from "@/lib/format";
import type { Article } from "@/lib/types";

type ArticleCardProps = {
  article: Article;
  variant?: "default" | "compact" | "horizontal";
};

export function ArticleCard({ article, variant = "default" }: ArticleCardProps) {
  if (variant === "compact") {
    return (
      <article className="border-b border-rule py-4 last:border-b-0">
        <p className="text-xs tracking-wide text-accent">{article.category.name}</p>
        <h3 className="mt-1 font-display text-lg leading-snug">
          <Link href={`/article/${article.slug}`} className="hover:text-accent">
            {article.title}
          </Link>
        </h3>
        <p className="mt-2 text-xs text-muted">
          {formatDate(article.publishedAt)} · {formatReadingTime(article.readingMinutes)}
        </p>
      </article>
    );
  }

  if (variant === "horizontal") {
    return (
      <article className="grid gap-4 border-b border-rule py-6 last:border-b-0 sm:grid-cols-[220px_1fr]">
        <Link href={`/article/${article.slug}`} className="relative aspect-[16/10] overflow-hidden rounded-md">
          <Image
            src={article.coverImage}
            alt={article.coverAlt}
            fill
            sizes="(max-width: 640px) 100vw, 220px"
            className="object-cover"
          />
        </Link>
        <div>
          <p className="text-xs tracking-wide text-accent">{article.category.name}</p>
          <h3 className="mt-1 font-display text-2xl leading-snug">
            <Link href={`/article/${article.slug}`} className="hover:text-accent">
              {article.title}
            </Link>
          </h3>
          <p className="mt-2 text-[15px] leading-7 text-muted">{article.excerpt}</p>
          <p className="mt-3 text-xs text-muted">
            {article.author.name} · {formatDate(article.publishedAt)}
          </p>
        </div>
      </article>
    );
  }

  return (
    <article>
      <Link href={`/article/${article.slug}`} className="relative block aspect-[16/10] overflow-hidden rounded-md">
        <Image
          src={article.coverImage}
          alt={article.coverAlt}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-500 hover:scale-[1.03]"
        />
      </Link>
      <p className="mt-3 text-xs tracking-wide text-accent">{article.category.name}</p>
      <h3 className="mt-1 font-display text-xl leading-snug">
        <Link href={`/article/${article.slug}`} className="hover:text-accent">
          {article.title}
        </Link>
      </h3>
      <p className="mt-2 text-sm leading-7 text-muted">{article.excerpt}</p>
      <p className="mt-3 text-xs text-muted">
        {formatDate(article.publishedAt)} · {formatReadingTime(article.readingMinutes)}
      </p>
    </article>
  );
}
