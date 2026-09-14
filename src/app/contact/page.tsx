import type { Metadata } from "next";

import { ContactForm } from "@/app/contact/contact-form";
import { JsonLd } from "@/components/json-ld";
import { absoluteUrl, breadcrumbJsonLd } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "যোগাযোগ",
  description: `${site.name}-এর সম্পাদকীয় দলের সঙ্গে যোগাযোগ করুন।`,
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "যোগাযোগ",
    description: `${site.name}-এর সম্পাদকীয় দলের সঙ্গে যোগাযোগ করুন।`,
    url: "/contact",
  },
};

export default function ContactPage() {
  return (
    <main id="main" className="mx-auto w-full max-w-2xl flex-1 px-4 py-12 sm:px-6">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ContactPage",
          name: "যোগাযোগ",
          url: absoluteUrl("/contact"),
          inLanguage: "bn-BD",
        }}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "প্রচ্ছদ", path: "/" },
          { name: "যোগাযোগ", path: "/contact" },
        ])}
      />
      <h1 className="font-display text-[2.35rem] font-semibold leading-[1.28] tracking-[-0.02em] sm:text-[2.75rem]">
        যোগাযোগ
      </h1>
      <p className="mt-4 text-[1.125rem] leading-8 text-muted">
        লেখা, সংশোধন বা সহযোগিতার প্রস্তাব পাঠান। আমরা সম্পাদকীয় ইমেইলেও উত্তর দিই।
      </p>
      <ContactForm />
    </main>
  );
}
