export type ContentBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "quote"; text: string }
  | { type: "image"; src: string; alt: string; caption?: string };

export type Author = {
  id: number;
  name: string;
  slug: string;
  bio: string;
  role: string;
  photo?: string | null;
  metaTitle?: string;
  metaDescription?: string;
};

export type Category = {
  id: number;
  name: string;
  slug: string;
  description: string;
  metaTitle?: string;
  metaDescription?: string;
};

export type Article = {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  coverAlt: string;
  publishedAt: string;
  updatedAt: string;
  readingMinutes: number;
  featured: boolean;
  category: Category;
  author: Author;
  tags: string[];
  blocks: ContentBlock[] | Record<string, unknown>;
  html?: string;
  metaTitle?: string;
  metaDescription?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  canonicalUrl?: string;
  robotsIndex?: boolean;
  robotsFollow?: boolean;
  inLanguage?: string;
};
