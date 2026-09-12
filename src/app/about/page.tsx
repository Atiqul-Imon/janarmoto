import type { Metadata } from "next";

import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "আমাদের কথা",
  description: `${site.name} কেন তৈরি হয়েছে এবং আমরা কী ধরনের লেখা প্রকাশ করি।`,
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <main id="main" className="mx-auto w-full max-w-2xl flex-1 px-4 py-10 sm:px-6">
      <h1 className="font-display text-4xl">আমাদের কথা</h1>
      <div className="article-body mt-8">
        <p>
          {site.name} একটি বাংলা প্ল্যাটফর্ম—খবরের শোরগোল নয়, জানার মতো লেখার জন্য। আমরা বিজ্ঞান, ইতিহাস, সমাজ,
          পরিবেশ ও সংস্কৃতি নিয়ে এমন গল্প প্রকাশ করতে চাই, যা পড়ার পর কিছু একটা মনে থাকে।
        </p>
        <p>
          সাইটটি বাংলাদেশকে কেন্দ্র করে তৈরি। ভাষা বাংলা, পাঠের আরাম প্রথম অগ্রাধিকার, আর সার্চ ইঞ্জিনে খুঁজে পাওয়া যায়
          এমন করে প্রতিটি পাতা সাজানো।
        </p>
        <p>
          সম্পাদকীয় নীতি সহজ: উৎস থাকবে, ভাষা পরিষ্কার থাকবে, ছবি অর্থপূর্ণ হবে। চটকদার শিরোনামের চেয়ে সত্য ও পাঠযোগ্যতা
          বেশি দামি।
        </p>
      </div>
    </main>
  );
}
