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

export function toAbsoluteUrl(path: string, base: string) {
  if (path.startsWith("http")) return path;
  return new URL(path, base).toString();
}
