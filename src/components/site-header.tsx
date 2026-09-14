import Link from "next/link";

import { getCategories } from "@/lib/api";
import { formatLongDate } from "@/lib/format";
import { site } from "@/lib/site";
import { SiteLogo } from "@/components/site-logo";
import { SearchForm } from "@/components/search-form";

export async function SiteHeader() {
  const categories = await getCategories();

  return (
    <header>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-sm focus:bg-ink focus:px-3 focus:py-2 focus:text-paper"
      >
        মূল লেখায় যান
      </a>

      <div className="border-b border-rule">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2 text-xs text-muted sm:px-6">
          <p>{formatLongDate()}</p>
          <p className="hidden sm:block">{site.domain}</p>
        </div>
      </div>

      <div className="border-b border-rule">
        <div className="mx-auto flex max-w-6xl flex-col items-center px-4 py-7 sm:px-6 sm:py-9">
          <Link href="/" className="flex flex-col items-center gap-3">
            <SiteLogo size={128} className="size-[5.5rem] sm:size-28" />
            <span className="sr-only">{site.name}</span>
            <p className="text-[0.95rem] text-muted sm:text-[1.05rem]">{site.tagline}</p>
          </Link>
        </div>
      </div>

      <div className="sticky top-0 z-50 border-b border-rule bg-paper/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-2 sm:px-6">
          <Link href="/" className="shrink-0" aria-label={site.name}>
            <SiteLogo size={36} className="size-8" />
          </Link>

          <nav aria-label="বিষয়" className="hidden min-w-0 flex-1 md:block">
            <ul className="flex flex-wrap items-center gap-x-5 gap-y-1 text-[0.9375rem] font-medium">
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
                <Link href="/about" className="text-ink/80 transition-colors hover:text-accent">
                  আমাদের কথা
                </Link>
              </li>
            </ul>
          </nav>

          <SearchForm compact inputId="header-q" className="ml-auto hidden max-w-[14rem] md:flex" />

          <details className="relative ml-auto md:hidden">
            <summary className="cursor-pointer list-none rounded-full border border-rule px-3 py-1 text-sm">
              মেনু
            </summary>
            <nav className="absolute right-0 z-20 mt-2 w-56 rounded-md border border-rule bg-paper p-3">
              <SearchForm compact inputId="mobile-q" />
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
      </div>
    </header>
  );
}
