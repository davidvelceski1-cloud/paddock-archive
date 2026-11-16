import { ImageResponse } from "next/og";

export const OG_SIZE = { width: 1200, height: 630 };

/** Shared Open Graph card: clean white canvas, large title, optional stat row. Original mark only. */
export function ogCard({ kicker, title, subtitle, stats }: { kicker: string; title: string; subtitle?: string; stats?: [string, string][] }) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          padding: "64px 72px",
          background: "#FFFFFF",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 26, color: "#6E6E73" }}>
          <div style={{ width: 32, height: 32, borderRadius: 16, border: "4px solid #1D1D1F", display: "flex" }} />
          Paddock Archive · {kicker}
        </div>
        <div style={{ marginTop: "auto", fontSize: title.length > 22 ? 84 : 112, lineHeight: 1, color: "#1D1D1F", letterSpacing: -3, fontWeight: 600 }}>{title}</div>
        {subtitle && <div style={{ marginTop: 20, fontSize: 32, color: "#6E6E73" }}>{subtitle}</div>}
        {stats && (
          <div style={{ display: "flex", gap: 56, marginTop: 40 }}>
            {stats.map(([label, value]) => (
              <div key={label} style={{ display: "flex", flexDirection: "column" }}>
                <div style={{ fontSize: 22, color: "#6E6E73" }}>{label}</div>
                <div style={{ fontSize: 46, color: "#1D1D1F", fontWeight: 600 }}>{value}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    ),
    OG_SIZE,
  );
}
