import Image from "next/image";
import Link from "next/link";

import { formatDate, formatReadingTime, formatRelativeTime } from "@/lib/format";
import type { Article } from "@/lib/types";

type ArticleCardProps = {
  article: Article;
  variant?: "default" | "compact" | "horizontal" | "overlay" | "rail";
};

export function ArticleCard({ article, variant = "default" }: ArticleCardProps) {
  if (variant === "overlay") {
    return (
      <article>
        <Link href={`/article/${article.slug}`} className="group relative block aspect-video overflow-hidden">
          <Image
            src={article.coverImage}
            alt={article.coverAlt}
            fill
            sizes="(max-width: 1024px) 100vw, 280px"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
          <span className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/5" />
          <span className="absolute inset-x-0 bottom-0 p-4 text-white">
            <span className="text-[0.625rem] font-medium text-white/80">{article.category.name}</span>
            <span className="mt-1 block font-display text-[1.225rem] font-bold leading-[1.15]">
              {article.title}
            </span>
          </span>
        </Link>
      </article>
    );
  }

  if (variant === "rail") {
    return (
      <article className="grid grid-cols-[minmax(0,1fr)_7rem] gap-3 border-b border-rule py-3.5 last:border-b-0">
        <div>
          <h3 className="font-display text-[0.925rem] font-semibold leading-[1.15]">
            <Link href={`/article/${article.slug}`} className="hover:text-lead">
              {article.title}
            </Link>
          </h3>
          <p className="mt-1 text-[0.625rem] text-muted">
            <time dateTime={article.publishedAt}>{formatRelativeTime(article.publishedAt)}</time>
          </p>
        </div>
        <Link href={`/article/${article.slug}`} className="relative aspect-video overflow-hidden">
          <Image
            src={article.coverImage}
            alt={article.coverAlt}
            fill
            sizes="112px"
            className="object-cover"
          />
        </Link>
      </article>
    );
  }

  if (variant === "compact") {
    return (
      <article className="border-b border-rule py-4 last:border-b-0">
        <p className="text-[0.8125rem] font-medium text-muted">
          <Link href={`/category/${article.category.slug}`} className="hover:text-ink">
            {article.category.name}
          </Link>
        </p>
        <h3 className="mt-1 font-display text-base font-semibold leading-[1.15]">
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
        <Link href={`/article/${article.slug}`} className="relative aspect-video overflow-hidden">
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
          <h3 className="mt-2 font-display text-[1.075rem] font-semibold leading-[1.15] sm:text-[1.195rem]">
            <Link href={`/article/${article.slug}`} className="hover:text-lead">
              {article.title}
            </Link>
          </h3>
          <p className="mt-2 line-clamp-2 text-[0.825rem] leading-5 text-muted">{article.excerpt}</p>
          <p className="mt-2 text-xs text-muted">
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
      <Link href={`/article/${article.slug}`} className="relative block aspect-video overflow-hidden">
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
      <h3 className="mt-2 font-display text-[1.095rem] font-semibold leading-[1.15]">
        <Link href={`/article/${article.slug}`} className="hover:text-lead">
          {article.title}
        </Link>
      </h3>
      <p className="mt-2 line-clamp-2 text-[0.825rem] leading-5 text-muted">{article.excerpt}</p>
      <p className="mt-3 text-xs text-muted">
        <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
        {" · "}
        {formatReadingTime(article.readingMinutes)}
      </p>
    </article>
  );
}
