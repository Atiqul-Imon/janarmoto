import Image from "next/image";
import Link from "next/link";

import { formatDate, formatReadingTime } from "@/lib/format";
import type { Article } from "@/lib/types";

export function FeaturedStory({ article }: { article: Article }) {
  return (
    <article className="grid gap-6 lg:grid-cols-2 lg:items-center">
      <Link href={`/article/${article.slug}`} className="relative block aspect-[16/11] overflow-hidden rounded-lg">
        <Image
          src={article.coverImage}
          alt={article.coverAlt}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
        />
      </Link>
      <div>
        <p className="text-[0.8125rem] font-medium text-accent">আজকের লেখা</p>
        <h2 className="mt-3 font-display text-[2rem] font-semibold leading-[1.28] tracking-[-0.02em] sm:text-[2.85rem]">
          <Link href={`/article/${article.slug}`} className="hover:text-accent">
            {article.title}
          </Link>
        </h2>
        <p className="mt-5 max-w-xl text-[1.125rem] leading-8 text-muted sm:text-[1.2rem] sm:leading-9">{article.excerpt}</p>
        <p className="mt-6 text-[0.9375rem] text-muted">
          <Link href={`/author/${article.author.slug}`} className="hover:text-ink">
            {article.author.name}
          </Link>
          {" · "}
          {formatDate(article.publishedAt)} · {formatReadingTime(article.readingMinutes)}
        </p>
      </div>
    </article>
  );
}
