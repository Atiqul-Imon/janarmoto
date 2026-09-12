import { site } from "@/lib/site";

export function ShareLinks({ title, path }: { title: string; path: string }) {
  const url = `${site.url}${path}`;
  const encoded = encodeURIComponent(url);
  const text = encodeURIComponent(title);

  return (
    <div className="flex flex-wrap items-center gap-3 text-sm">
      <span className="text-muted">শেয়ার:</span>
      <a
        className="underline decoration-rule underline-offset-4 hover:text-accent"
        href={`https://www.facebook.com/sharer/sharer.php?u=${encoded}`}
        rel="noopener noreferrer"
        target="_blank"
      >
        ফেসবুক
      </a>
      <a
        className="underline decoration-rule underline-offset-4 hover:text-accent"
        href={`https://twitter.com/intent/tweet?url=${encoded}&text=${text}`}
        rel="noopener noreferrer"
        target="_blank"
      >
        এক্স
      </a>
      <a
        className="underline decoration-rule underline-offset-4 hover:text-accent"
        href={`https://api.whatsapp.com/send?text=${text}%20${encoded}`}
        rel="noopener noreferrer"
        target="_blank"
      >
        হোয়াটসঅ্যাপ
      </a>
    </div>
  );
}
