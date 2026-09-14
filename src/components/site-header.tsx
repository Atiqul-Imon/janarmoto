import Link from "next/link";

import { getCategories } from "@/lib/api";
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

      <div className="mx-auto flex h-12 max-w-6xl items-center gap-4 px-4 sm:px-6">
        <Link href="/" className="flex shrink-0 items-center" aria-label={site.name}>
          <SiteLogo size={32} className="size-8" priority />
        </Link>

        <nav aria-label="বিষয়" className="hidden min-w-0 flex-1 md:block">
          <ul className="flex items-center gap-x-4 overflow-x-auto text-[0.875rem] font-medium whitespace-nowrap">
            {categories.map((category) => (
              <li key={category.slug}>
                <Link
                  href={`/category/${category.slug}`}
                  className="text-ink/75 transition-colors hover:text-accent"
                >
                  {category.name}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/about" className="text-ink/75 transition-colors hover:text-accent">
                আমাদের কথা
              </Link>
            </li>
          </ul>
        </nav>

        <SearchForm compact inputId="header-q" className="ml-auto hidden max-w-[12rem] md:flex" />

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
    </header>
  );
}
