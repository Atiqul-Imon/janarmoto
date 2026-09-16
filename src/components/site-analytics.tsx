import { GoogleAnalytics } from "@next/third-parties/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const gaId =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() || "G-X74ZL24WHC";

export function SiteAnalytics() {
  return (
    <>
      {gaId ? <GoogleAnalytics gaId={gaId} /> : null}
      <Analytics />
      <SpeedInsights />
    </>
  );
}
