import { ImageResponse } from "next/og";

import { profile } from "@/data/profile";

// Generated at build time — no image asset or paid service needed.
export const alt = `${profile.name} — ${profile.title}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0b0b0c",
          color: "#f4f4f1",
          padding: "72px",
        }}
      >
        <div style={{ fontSize: 28, letterSpacing: 4, color: "#9a9a94", display: "flex" }}>
          PORTFOLIO
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 84, fontWeight: 800, lineHeight: 1.05, display: "flex" }}>
            {profile.name}
          </div>
          <div style={{ fontSize: 38, color: "#c9c9c2", marginTop: 20, display: "flex" }}>
            {profile.title}
          </div>
        </div>
        <div style={{ fontSize: 28, color: "#9a9a94", display: "flex" }}>
          github.com/121198a
        </div>
      </div>
    ),
    { ...size }
  );
}
