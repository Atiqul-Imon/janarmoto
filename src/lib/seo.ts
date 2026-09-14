import type { Metadata } from "next";

import { site } from "@/lib/site";

export const organizationId = `${site.url}/#organization`;
export const websiteId = `${site.url}/#website`;

export function absoluteUrl(pathOrUrl = "/"): string {
  if (/^https?:\/\//i.test(pathOrUrl)) {
    try {
      const parsed = new URL(pathOrUrl);
      if (parsed.hostname === "janarmoto.com" || parsed.hostname === "www.janarmoto.com") {
        return `${site.url}${parsed.pathname}${parsed.search}`;
      }
      return parsed.toString();
    } catch {
      return site.url;
    }
  }

  return new URL(pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`, `${site.url}/`).toString();
}

export function listingPath(path: string, page = 1): string {
  return page > 1 ? `${path}?page=${page}` : path;
}

export function pageTitle(title: string, page = 1): string {
  if (page > 1) return `${title} · পাতা ${page.toLocaleString("bn-BD")}`;
  return title;
}

export function socialImage(url: string, alt: string) {
  return [{ url: absoluteUrl(url), alt, width: 1200, height: 630 }];
}

export function listingMetadata({
  title,
  description,
  path,
  page = 1,
}: {
  title: string;
  description: string;
  path: string;
  page?: number;
}): Metadata {
  const canonical = listingPath(path, page);
  const titled = pageTitle(title, page);

  return {
    title: titled,
    description,
    alternates: { canonical },
    openGraph: {
      type: "website",
      locale: site.locale,
      url: canonical,
      siteName: site.name,
      title: titled,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title: titled,
      description,
    },
  };
}

export function publisherJsonLd() {
  return {
    "@type": "NewsMediaOrganization",
    "@id": organizationId,
    name: site.name,
    alternateName: site.nameEn,
    url: site.url,
    logo: {
      "@type": "ImageObject",
      url: absoluteUrl("/icon-192.png"),
      width: 192,
      height: 192,
    },
    image: absoluteUrl("/logo.webp"),
    email: site.email,
    inLanguage: "bn-BD",
    address: {
      "@type": "PostalAddress",
      addressCountry: "BD",
    },
    areaServed: {
      "@type": "Country",
      name: "Bangladesh",
    },
    publishingPrinciples: absoluteUrl("/about"),
  };
}

export function websiteJsonLd() {
  return {
    "@type": "WebSite",
    "@id": websiteId,
    name: site.name,
    alternateName: site.nameEn,
    url: site.url,
    inLanguage: "bn-BD",
    publisher: { "@id": organizationId },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${site.url}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function itemListJsonLd(
  items: { name: string; path: string }[],
  listPath: string,
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    url: absoluteUrl(listPath),
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: absoluteUrl(item.path),
      name: item.name,
    })),
  };
}

export function wordCountFromHtml(html?: string) {
  if (!html) return undefined;
  const text = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  const count = text.split(" ").filter(Boolean).length;
  return count > 0 ? count : undefined;
}
