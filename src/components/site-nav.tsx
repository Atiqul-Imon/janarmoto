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
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  const navItems = [
    { href: "/", label: "প্রচ্ছদ" },
    ...categories.map((category) => ({ href: `/category/${category.slug}`, label: category.name })),
  ];

  return (
    <>
      <div className="mx-auto flex h-[4.25rem] max-w-7xl items-center gap-3 px-4 sm:px-6">
        <button
          type="button"
          className="inline-flex size-10 items-center justify-center text-ink hover:text-accent lg:hidden"
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

        <Link href="/" className="flex min-w-0 items-center gap-2.5" aria-label={site.name}>
          <SiteLogo size={44} className="size-11" priority />
          <span className="font-display text-[1.65rem] font-bold tracking-[-0.03em] sm:text-[1.9rem]">
            {site.name}
          </span>
        </Link>

        <div className="ml-auto flex items-center gap-1">
          <SearchForm compact inputId="header-q" className="hidden max-w-[16rem] lg:flex" />
          <button
            type="button"
            className="inline-flex size-10 items-center justify-center text-ink hover:text-accent lg:hidden"
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
        </div>
      </div>

      {searchOpen ? (
        <div id="mobile-search" className="border-t border-rule px-4 py-3 lg:hidden sm:px-6">
          <SearchForm inputId="mobile-q" className="max-w-none" />
        </div>
      ) : null}

      <nav aria-label="বিষয়" className="border-t border-rule bg-white">
        <ul className="mx-auto flex max-w-7xl items-center gap-x-0 overflow-x-auto px-2 text-[0.92rem] font-medium whitespace-nowrap sm:px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`inline-flex h-11 items-center px-3 transition-colors hover:text-accent ${
                  isActive(item.href) ? "text-accent" : "text-ink/80"
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
          <li className="hidden sm:block">
            <Link
              href="/about"
              className={`inline-flex h-11 items-center px-3 hover:text-accent ${
                isActive("/about") ? "text-accent" : "text-ink/80"
              }`}
            >
              আমাদের কথা
            </Link>
          </li>
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
            className="relative z-10 flex h-dvh w-full max-w-[22rem] flex-col bg-white shadow-[-12px_0_40px_rgba(26,22,18,0.12)] sm:max-w-[26rem]"
          >
            <div className="flex h-14 items-center justify-between border-b border-rule px-4">
              <Link href="/" className="flex items-center gap-2" aria-label={site.name}>
                <SiteLogo size={32} className="size-8" />
                <span className="font-display text-lg font-bold">{site.name}</span>
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
                {navItems.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`flex min-h-12 items-center justify-between border-b border-rule px-5 text-[1.05rem] ${
                        isActive(item.href) ? "text-accent" : "text-ink"
                      }`}
                    >
                      <span>{item.label}</span>
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
