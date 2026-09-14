import Image from "next/image";

import { site } from "@/lib/site";

type SiteLogoProps = {
  size?: number;
  className?: string;
};

export function SiteLogo({ size = 64, className = "" }: SiteLogoProps) {
  return (
    <Image
      src="/logo.webp"
      alt={site.name}
      width={size}
      height={size}
      priority={size >= 64}
      className={`rounded-full object-cover ${className}`}
    />
  );
}
