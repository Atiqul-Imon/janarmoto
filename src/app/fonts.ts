import localFont from "next/font/local";

export const varendra = localFont({
  src: [
    {
      path: "../../fonts-source/Varendra-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../fonts-source/Varendra-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../fonts-source/Varendra-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-varendra",
  display: "swap",
});
