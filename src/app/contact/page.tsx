import type { Metadata } from "next";

import { ContactForm } from "@/app/contact/contact-form";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "যোগাযোগ",
  description: `${site.name}-এর সম্পাদকীয় দলের সঙ্গে যোগাযোগ করুন।`,
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <main id="main" className="mx-auto w-full max-w-2xl flex-1 px-4 py-12 sm:px-6">
      <h1 className="font-display text-[2.35rem] font-semibold leading-[1.28] tracking-[-0.02em] sm:text-[2.75rem]">
        যোগাযোগ
      </h1>
      <p className="mt-4 text-[1.125rem] leading-8 text-muted">
        লেখা, সংশোধন বা সহযোগিতার প্রস্তাব পাঠান। লারাভেল ব্যাকএন্ড চালু হলে এই ফর্ম সরাসরি সার্ভারে যাবে।
      </p>
      <ContactForm />
    </main>
  );
}
