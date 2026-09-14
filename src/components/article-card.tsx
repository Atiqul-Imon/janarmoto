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
        <p className="text-[0.8125rem] font-medium text-muted">
          <Link href={`/category/${article.category.slug}`} className="hover:text-ink">
            {article.category.name}
          </Link>
        </p>
        <h3 className="mt-1 font-display text-lg font-semibold leading-[1.4]">
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
          <p className="text-[0.8125rem] font-medium text-muted">
            <Link href={`/category/${article.category.slug}`} className="hover:text-ink">
              {article.category.name}
            </Link>
          </p>
          <h3 className="mt-2 font-display text-[1.45rem] font-semibold leading-[1.35] sm:text-[1.65rem]">
            <Link href={`/article/${article.slug}`} className="hover:text-accent">
              {article.title}
            </Link>
          </h3>
          <p className="mt-3 text-[1.05rem] leading-8 text-muted">{article.excerpt}</p>
          <p className="mt-3 text-xs text-muted">
            <Link href={`/author/${article.author.slug}`} className="hover:text-ink">
              {article.author.name}
            </Link>
            {" · "}
            <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
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
      <p className="mt-3 text-[0.8125rem] font-medium text-muted">
        <Link href={`/category/${article.category.slug}`} className="hover:text-ink">
          {article.category.name}
        </Link>
      </p>
      <h3 className="mt-2 font-display text-[1.35rem] font-semibold leading-[1.35]">
        <Link href={`/article/${article.slug}`} className="hover:text-accent">
          {article.title}
        </Link>
      </h3>
      <p className="mt-2 text-[1.0125rem] leading-8 text-muted">{article.excerpt}</p>
      <p className="mt-3 text-xs text-muted">
        <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
        {" · "}
        {formatReadingTime(article.readingMinutes)}
      </p>
    </article>
  );
}
