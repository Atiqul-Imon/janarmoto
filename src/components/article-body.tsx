import Image from "next/image";

import { sanitizeArticleHtml } from "@/lib/sanitize-article-html";
import type { ContentBlock } from "@/lib/types";

export function ArticleBody({
  html,
  blocks = [],
}: {
  html?: string;
  blocks?: ContentBlock[] | Record<string, unknown>;
}) {
  if (html) {
    return (
      <div
        className="article-body"
        dangerouslySetInnerHTML={{ __html: sanitizeArticleHtml(html) }}
      />
    );
  }

  if (!Array.isArray(blocks)) {
    return null;
  }

  return (
    <div className="article-body">
      {blocks.map((block, index) => {
        if (block.type === "p") {
          return <p key={index}>{block.text}</p>;
        }
        if (block.type === "h2") {
          return <h2 key={index}>{block.text}</h2>;
        }
        if (block.type === "quote") {
          return <blockquote key={index}>{block.text}</blockquote>;
        }
        return (
          <figure key={index} className="my-10">
            <div className="relative aspect-[16/10] overflow-hidden rounded-md">
              <Image src={block.src} alt={block.alt} fill sizes="(max-width: 768px) 100vw, 720px" className="object-cover" />
            </div>
            {block.caption ? <figcaption className="mt-2 text-center text-sm text-muted">{block.caption}</figcaption> : null}
          </figure>
        );
      })}
    </div>
  );
}
