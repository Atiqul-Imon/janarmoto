import Image from "next/image";
import Link from "next/link";

import { formatRelativeTime } from "@/lib/format";
import type { Article } from "@/lib/types";

export function FeaturedStory({ article }: { article: Article }) {
  return (
    <article>
      <Link href={`/article/${article.slug}`} className="relative block aspect-video overflow-hidden">
        <Image
          src={article.coverImage}
          alt={article.coverAlt}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 48vw"
          className="object-cover"
        />
      </Link>
      <p className="mt-3 text-[0.78rem] font-semibold tracking-wide text-accent">{article.category.name}</p>
      <h2 className="mt-1.5 font-display text-[1.85rem] font-bold leading-[1.28] tracking-[-0.02em] text-lead sm:text-[2.15rem]">
        <Link href={`/article/${article.slug}`} className="hover:text-accent">
          {article.title}
        </Link>
      </h2>
      <p className="mt-3 text-[1.02rem] leading-7 text-muted">{article.excerpt}</p>
      <p className="mt-3 text-[0.8rem] text-muted">
        <time dateTime={article.publishedAt}>{formatRelativeTime(article.publishedAt)}</time>
      </p>
    </article>
  );
}
