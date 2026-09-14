import Image from "next/image";

import { site } from "@/lib/site";

type SiteLogoProps = {
  size?: number;
  className?: string;
  priority?: boolean;
};

export function SiteLogo({ size = 64, className = "", priority = false }: SiteLogoProps) {
  return (
    <Image
      src="/logo.webp"
      alt={site.name}
      width={size}
      height={size}
      priority={priority}
      className={`rounded-full object-cover ${className}`}
    />
  );
}
