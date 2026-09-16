import { site } from "@/lib/site";

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-[18px]" fill="currentColor" aria-hidden>
      <path d="M14 8.2h3.1V4.4H14c-2.9 0-5.2 2.3-5.2 5.2v2.7H6v3.8h2.8V22h3.9v-5.9h3.1l.8-3.8h-3.9v-2.3c0-.7.5-1.2 1.3-1.2Z" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden>
      <path d="M14.7 10.3 22 2h-2.2l-6.3 7.1L8.3 2H2l7.7 10.9L2 22h2.2l6.8-7.6L15.7 22H22l-7.3-11.7Zm-1 1.4 1.1 1.5 4.8 6.2h-1.9l-3.9-5.1-1.1-1.5-5-6.5h1.9l4.1 5.4Z" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-[18px]" fill="currentColor" aria-hidden>
      <path d="M12.04 2C6.5 2 2 6.4 2 11.8c0 1.7.5 3.4 1.4 4.9L2 22l5.4-1.4c1.4.8 3 1.2 4.6 1.2 5.5 0 10-4.4 10-9.8C22 6.4 17.5 2 12.04 2Zm0 17.8c-1.4 0-2.8-.4-4-1.1l-.3-.2-3.2.8.9-3.1-.2-.3c-.8-1.3-1.2-2.7-1.2-4.2 0-4.5 3.7-8.1 8.1-8.1 4.4 0 8.1 3.6 8.1 8.1-.1 4.5-3.8 8.1-8.2 8.1Zm4.4-5.9c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.5.1l-.8 1c-.1.1-.2.2-.5.1-.9-.4-1.8-1.1-2.5-2-.6-.7-1.1-1.6-1.2-1.8-.1-.2 0-.3.1-.5l.4-.5c.1-.1.1-.3.2-.4 0-.1 0-.3 0-.4-.1-.1-.5-1.3-.7-1.8-.2-.5-.4-.4-.5-.4h-.4c-.2 0-.4.1-.6.3-.2.2-.8.8-.8 1.9s.8 2.2.9 2.3c.1.2 1.6 2.5 3.9 3.4 1.5.6 1.8.5 2.5.4.4-.1 1.4-.6 1.6-1.1.2-.5.2-1 .1-1.1 0-.1-.2-.2-.4-.3Z" />
    </svg>
  );
}

const networks = [
  {
    name: "ফেসবুক",
    href: (url: string) => `https://www.facebook.com/sharer/sharer.php?u=${url}`,
    icon: FacebookIcon,
  },
  {
    name: "এক্স",
    href: (url: string, text: string) => `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
    icon: XIcon,
  },
  {
    name: "হোয়াটসঅ্যাপ",
    href: (url: string, text: string) => `https://api.whatsapp.com/send?text=${text}%20${url}`,
    icon: WhatsAppIcon,
  },
] as const;

export function ShareLinks({ title, path }: { title: string; path: string }) {
  const url = encodeURIComponent(`${site.url}${path}`);
  const text = encodeURIComponent(title);

  return (
    <div className="flex flex-wrap items-center gap-2.5">
      <span className="text-sm text-muted">শেয়ার</span>
      <ul className="flex items-center gap-1.5">
        {networks.map((network) => (
          <li key={network.name}>
            <a
              href={network.href(url, text)}
              rel="noopener noreferrer"
              target="_blank"
              aria-label={`${network.name}-এ শেয়ার করুন`}
              className="inline-flex size-10 items-center justify-center rounded-full border border-rule text-ink transition-colors hover:border-accent hover:text-accent"
            >
              <network.icon />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
