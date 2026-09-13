import Link from "next/link";

import { site } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-rule bg-paper">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div>
          <p className="font-display text-[1.65rem] font-semibold tracking-[-0.02em]">{site.name}</p>
          <p className="mt-3 max-w-sm text-[0.975rem] leading-7 text-muted">{site.description}</p>
        </div>
        <div>
          <p className="text-sm font-medium">লিংক</p>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li>
              <Link href="/about">আমাদের কথা</Link>
            </li>
            <li>
              <Link href="/contact">যোগাযোগ</Link>
            </li>
            <li>
              <a href="/rss.xml">আরএসএস</a>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-medium">সম্পাদকীয়</p>
          <p className="mt-3 text-sm leading-7 text-muted">
            লেখা পাঠাতে চাইলে ইমেইল করুন{" "}
            <a className="text-ink underline decoration-rule underline-offset-4" href={`mailto:${site.email}`}>
              {site.email}
            </a>
          </p>
        </div>
      </div>
      <div className="border-t border-rule py-4 text-center text-xs text-muted">
        © {new Date().getFullYear()} {site.name}. সর্বস্বত্ব সংরক্ষিত।
      </div>
    </footer>
  );
}
