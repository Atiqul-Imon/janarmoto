import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "পাতাটি নেই",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main id="main" className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center px-4 py-24 text-center">
      <p className="text-[0.8125rem] font-medium text-accent">৪০৪</p>
      <h1 className="mt-3 font-display text-[2.35rem] font-semibold leading-[1.28] tracking-[-0.02em]">পাতাটি নেই</h1>
      <p className="mt-3 text-[1.125rem] leading-8 text-muted">আপনি যে ঠিকানায় এসেছেন, সেখানে কোনো লেখা নেই।</p>
      <Link href="/" className="mt-6 text-sm underline decoration-rule underline-offset-4">
        প্রচ্ছদে ফিরে যান
      </Link>
    </main>
  );
}
