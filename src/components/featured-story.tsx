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
        <p className="text-xs font-medium tracking-[0.18em] text-accent">আজকের লেখা</p>
        <h2 className="mt-3 font-display text-3xl leading-tight sm:text-5xl">
          <Link href={`/article/${article.slug}`} className="hover:text-accent">
            {article.title}
          </Link>
        </h2>
        <p className="mt-4 max-w-xl text-base leading-8 text-muted sm:text-lg">{article.excerpt}</p>
        <p className="mt-5 text-sm text-muted">
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
