import { getCategories } from "@/lib/api";
import { SiteNav } from "@/components/site-nav";

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
      <SiteNav categories={categories} />
    </header>
  );
}
