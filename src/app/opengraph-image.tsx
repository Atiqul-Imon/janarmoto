import { ImageResponse } from "next/og";

import { site } from "@/lib/site";

export const alt = `${site.name} — ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#f5f5f5",
          color: "#17140f",
          padding: "72px",
        }}
      >
        <div style={{ display: "flex", fontSize: 28, letterSpacing: 6, color: "#fc2a21" }}>JANAR MOTO</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 72, fontWeight: 700, lineHeight: 1.1 }}>Worth knowing,</div>
          <div style={{ fontSize: 72, fontWeight: 700, lineHeight: 1.1 }}>in Bangla.</div>
        </div>
        <div style={{ display: "flex", fontSize: 28, color: "#5e584e" }}>{site.domain}</div>
      </div>
    ),
    { ...size },
  );
}
