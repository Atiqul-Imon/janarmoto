const dateFormatter = new Intl.DateTimeFormat("bn-BD", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

const longDateFormatter = new Intl.DateTimeFormat("bn-BD", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});

export function formatDate(iso: string) {
  return dateFormatter.format(new Date(iso));
}

export function formatLongDate(date = new Date()) {
  return longDateFormatter.format(date);
}

export function formatReadingTime(minutes: number) {
  return `${minutes.toLocaleString("bn-BD")} মিনিটের পড়া`;
}

export function formatRelativeTime(iso: string) {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return formatDate(iso);

  const minutes = Math.max(1, Math.round((Date.now() - then) / 60_000));
  if (minutes < 60) return `${minutes.toLocaleString("bn-BD")} মিনিট আগে`;

  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours.toLocaleString("bn-BD")} ঘণ্টা আগে`;

  const days = Math.round(hours / 24);
  if (days < 7) return `${days.toLocaleString("bn-BD")} দিন আগে`;

  return formatDate(iso);
}

export function toAbsoluteUrl(path: string, base: string) {
  if (path.startsWith("http")) return path;
  return new URL(path, base).toString();
}
