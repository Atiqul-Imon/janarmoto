"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";

import { SearchForm } from "@/components/search-form";
import { SiteLogo } from "@/components/site-logo";
import { site } from "@/lib/site";
import type { Category } from "@/lib/types";

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" strokeLinecap="round" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
    </svg>
  );
}

export function SiteNav({ categories }: { categories: Category[] }) {
  const pathname = usePathname();
  const drawerId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setMenuOpen(false);
    }

    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <>
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-3 px-4 sm:px-6">
        <Link href="/" className="flex shrink-0 items-center" aria-label={site.name}>
          <SiteLogo size={36} className="size-9" priority />
        </Link>

        <nav aria-label="বিষয়" className="hidden min-w-0 flex-1 lg:block">
          <ul className="flex items-center gap-x-5 overflow-x-auto text-[0.9375rem] font-medium whitespace-nowrap">
            {categories.map((category) => (
              <li key={category.slug}>
                <Link
                  href={`/category/${category.slug}`}
                  className={`transition-colors hover:text-accent ${
                    isActive(`/category/${category.slug}`) ? "text-accent" : "text-ink/75"
                  }`}
                >
                  {category.name}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/about"
                className={`transition-colors hover:text-accent ${isActive("/about") ? "text-accent" : "text-ink/75"}`}
              >
                আমাদের কথা
              </Link>
            </li>
          </ul>
        </nav>

        <SearchForm compact inputId="header-q" className="ml-auto hidden max-w-[13.5rem] lg:flex" />

        <div className="ml-auto flex items-center gap-1 lg:hidden">
          <button
            type="button"
            className="inline-flex size-11 items-center justify-center rounded-full text-ink hover:bg-rule/60"
            aria-expanded={searchOpen}
            aria-controls="mobile-search"
            aria-label={searchOpen ? "খোঁজ বন্ধ করুন" : "খুঁজুন"}
            onClick={() => {
              setMenuOpen(false);
              setSearchOpen((open) => !open);
            }}
          >
            {searchOpen ? <CloseIcon /> : <SearchIcon />}
          </button>
          <button
            type="button"
            className="inline-flex size-11 items-center justify-center rounded-full text-ink hover:bg-rule/60"
            aria-expanded={menuOpen}
            aria-controls={drawerId}
            aria-label="মেনু খুলুন"
            onClick={() => {
              setSearchOpen(false);
              setMenuOpen(true);
            }}
          >
            <MenuIcon />
          </button>
        </div>
      </div>

      {searchOpen ? (
        <div id="mobile-search" className="border-t border-rule px-4 py-3 lg:hidden sm:px-6">
          <SearchForm inputId="mobile-q" className="max-w-none" />
        </div>
      ) : null}

      <nav
        aria-label="বিষয়"
        className="border-t border-rule lg:hidden"
      >
        <ul className="flex gap-1 overflow-x-auto px-4 py-2.5 text-[0.875rem] font-medium whitespace-nowrap sm:px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {categories.map((category) => (
            <li key={category.slug}>
              <Link
                href={`/category/${category.slug}`}
                className={`inline-flex h-9 items-center rounded-full px-3.5 ${
                  isActive(`/category/${category.slug}`)
                    ? "bg-ink text-paper"
                    : "bg-rule/55 text-ink hover:bg-rule"
                }`}
              >
                {category.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {menuOpen ? (
        <div className="fixed inset-0 z-[60] flex justify-end lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-ink/45"
            aria-label="মেনু বন্ধ করুন"
            onClick={() => setMenuOpen(false)}
          />
          <div
            id={drawerId}
            role="dialog"
            aria-modal="true"
            aria-label="সাইট মেনু"
            className="relative z-10 flex h-dvh w-full max-w-[22rem] flex-col bg-paper shadow-[-12px_0_40px_rgba(26,22,18,0.12)] sm:max-w-[26rem]"
          >
            <div className="flex h-14 items-center justify-between border-b border-rule px-4">
              <Link href="/" className="flex items-center gap-2" aria-label={site.name}>
                <SiteLogo size={32} className="size-8" />
                <span className="font-display text-lg font-semibold">{site.name}</span>
              </Link>
              <button
                ref={closeRef}
                type="button"
                className="inline-flex size-11 items-center justify-center rounded-full hover:bg-rule/60"
                aria-label="মেনু বন্ধ করুন"
                onClick={() => setMenuOpen(false)}
              >
                <CloseIcon />
              </button>
            </div>

            <div className="border-b border-rule px-4 py-4">
              <SearchForm inputId="drawer-q" className="max-w-none" />
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto">
              <p className="px-5 pt-5 text-[0.75rem] font-medium tracking-[0.14em] text-muted">বিষয়</p>
              <ul className="mt-2">
                {categories.map((category) => (
                  <li key={category.slug}>
                    <Link
                      href={`/category/${category.slug}`}
                      className={`flex min-h-12 items-center justify-between border-b border-rule px-5 text-[1.05rem] ${
                        isActive(`/category/${category.slug}`) ? "text-accent" : "text-ink"
                      }`}
                    >
                      <span>{category.name}</span>
                      <span className="text-muted" aria-hidden>
                        ›
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>

              <ul className="py-3">
                <li>
                  <Link href="/about" className="flex min-h-12 items-center px-5 text-[1.05rem]">
                    আমাদের কথা
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="flex min-h-12 items-center px-5 text-[1.05rem]">
                    যোগাযোগ
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
