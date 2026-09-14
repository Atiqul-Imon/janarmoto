import Link from "next/link";

import { getCategories } from "@/lib/api";
import { formatLongDate } from "@/lib/format";
import { site } from "@/lib/site";
import { SiteLogo } from "@/components/site-logo";
import { SearchForm } from "@/components/search-form";

export async function SiteHeader() {
  const categories = await getCategories();

  return (
    <header className="sticky top-0 z-50 border-b border-rule bg-paper/95 backdrop-blur-sm">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-sm focus:bg-ink focus:px-3 focus:py-2 focus:text-paper"
      >
        মূল লেখায় যান
      </a>
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2 text-xs text-muted sm:px-6">
        <p>{formatLongDate()}</p>
        <p className="hidden sm:block">{site.domain}</p>
      </div>
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 pb-4 sm:px-6">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3 sm:gap-4">
            <SiteLogo size={72} className="size-14 sm:size-[4.5rem]" />
            <span>
              <span className="sr-only">{site.name}</span>
              <p className="text-[0.95rem] leading-6 text-muted sm:text-[1.05rem]">{site.tagline}</p>
            </span>
          </Link>
          <SearchForm className="hidden md:flex" />
          <details className="relative md:hidden">
            <summary className="cursor-pointer list-none rounded-full border border-rule px-3 py-1.5 text-sm">
              মেনু
            </summary>
            <nav className="absolute right-0 z-20 mt-2 w-56 rounded-lg border border-rule bg-paper p-3 shadow-lg">
              <SearchForm />
              <ul className="mt-3 space-y-2 text-sm">
                {categories.map((category) => (
                  <li key={category.slug}>
                    <Link href={`/category/${category.slug}`}>{category.name}</Link>
                  </li>
                ))}
                <li>
                  <Link href="/about">আমাদের কথা</Link>
                </li>
              </ul>
            </nav>
          </details>
        </div>
        <nav aria-label="বিষয়" className="hidden border-t border-rule pt-3 md:block">
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-[0.975rem]">
            {categories.map((category) => (
              <li key={category.slug}>
                <Link
                  href={`/category/${category.slug}`}
                  className="text-ink/80 transition-colors hover:text-accent"
                >
                  {category.name}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/about" className="text-ink/80 hover:text-accent">
                আমাদের কথা
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
