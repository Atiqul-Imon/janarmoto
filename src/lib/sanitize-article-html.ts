const ALLOWED_TAGS = new Set([
  "p",
  "h2",
  "h3",
  "h4",
  "blockquote",
  "ul",
  "ol",
  "li",
  "a",
  "strong",
  "em",
  "b",
  "i",
  "u",
  "s",
  "code",
  "pre",
  "hr",
  "br",
  "img",
  "figure",
  "figcaption",
  "table",
  "thead",
  "tbody",
  "tr",
  "th",
  "td",
  "span",
  "mark",
  "small",
  "sup",
  "sub",
  "div",
]);

const ALLOWED_ATTR: Record<string, Set<string>> = {
  a: new Set(["href", "title", "rel", "target"]),
  img: new Set(["src", "alt", "title", "width", "height", "loading"]),
  td: new Set(["colspan", "rowspan"]),
  th: new Set(["colspan", "rowspan"]),
  span: new Set(["class", "style", "data-color"]),
  mark: new Set(["class", "data-color"]),
  div: new Set(["class"]),
  figure: new Set(["class"]),
  p: new Set(["class", "style"]),
  h2: new Set(["class"]),
  h3: new Set(["class"]),
  h4: new Set(["class"]),
  blockquote: new Set(["class"]),
};

function isSafeUrl(value: string): boolean {
  const trimmed = value.trim().toLowerCase();
  return (
    trimmed.startsWith("https://") ||
    trimmed.startsWith("http://") ||
    trimmed.startsWith("/") ||
    trimmed.startsWith("#") ||
    trimmed.startsWith("mailto:")
  );
}

export function sanitizeArticleHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "")
    .replace(/<iframe[\s\S]*?>[\s\S]*?<\/iframe>/gi, "")
    .replace(/<\/?([^>\s]+)([^>]*)>/gi, (full, rawTag: string, rawAttrs: string) => {
      const isClosing = full.startsWith("</");
      const tag = rawTag.toLowerCase();

      if (!ALLOWED_TAGS.has(tag)) {
        return "";
      }

      if (isClosing) {
        return `</${tag}>`;
      }

      if (tag === "br" || tag === "hr") {
        return `<${tag}>`;
      }

      const allowed = ALLOWED_ATTR[tag];
      if (!allowed || !rawAttrs) {
        return `<${tag}>`;
      }

      const attrs: string[] = [];
      const attrPattern = /([a-zA-Z_:][\w:.-]*)(?:\s*=\s*("([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;
      let match: RegExpExecArray | null;

      while ((match = attrPattern.exec(rawAttrs)) !== null) {
        const name = match[1].toLowerCase();
        if (!allowed.has(name) || name.startsWith("on")) {
          continue;
        }

        const value = match[3] ?? match[4] ?? match[5] ?? "";
        if ((name === "href" || name === "src") && !isSafeUrl(value)) {
          continue;
        }

        attrs.push(`${name}="${value.replaceAll('"', "&quot;")}"`);
      }

      return attrs.length ? `<${tag} ${attrs.join(" ")}>` : `<${tag}>`;
    });
}
