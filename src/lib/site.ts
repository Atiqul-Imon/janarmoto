function publicSiteUrl() {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (fromEnv) return fromEnv.replace(/\/$/, "");

  const vercelHost = process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL;
  if (vercelHost) return `https://${vercelHost.replace(/^https?:\/\//, "")}`;

  return "https://www.janarmoto.com";
}

export const site = {
  name: "জানার মতো",
  nameEn: "Janar Moto",
  domain: "janarmoto.com",
  tagline: "যা জানা দরকার",
  description:
    "জানার মতো — বাংলাদেশের জন্য একটি পরিচ্ছন্ন বাংলা ব্লগ ও নিউজপোর্টাল। বিজ্ঞান, ইতিহাস, সমাজ, পরিবেশ ও সংস্কৃতি নিয়ে জানার মতো গল্প।",
  url: publicSiteUrl(),
  locale: "bn_BD",
  language: "bn",
  email: "editor@janarmoto.com",
} as const;

export const apiUrl = process.env.NEXT_PUBLIC_API_URL?.trim() ?? "";
