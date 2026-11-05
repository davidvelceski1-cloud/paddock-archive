import { ImageResponse } from "next/og";

export const OG_SIZE = { width: 1200, height: 630 };

/** Shared Open Graph card: soft accent glow, large title, optional stat row. Original mark only. */
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
          background: "#FAFAFB",
          backgroundImage:
            "radial-gradient(55% 75% at 10% 0%, rgba(99,102,241,0.18), transparent 70%), radial-gradient(45% 65% at 55% 0%, rgba(139,92,246,0.12), transparent 70%), radial-gradient(50% 75% at 98% 0%, rgba(249,115,98,0.16), transparent 70%)",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 26, color: "#5B6075" }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(120deg,#6366F1,#8B5CF6 55%,#F97362)", display: "flex" }} />
          Paddock Archive · {kicker}
        </div>
        <div style={{ marginTop: "auto", fontSize: title.length > 22 ? 84 : 112, lineHeight: 1, color: "#0F1222", letterSpacing: -3, fontWeight: 700 }}>{title}</div>
        {subtitle && <div style={{ marginTop: 20, fontSize: 32, color: "#5B6075" }}>{subtitle}</div>}
        {stats && (
          <div style={{ display: "flex", gap: 56, marginTop: 40 }}>
            {stats.map(([label, value]) => (
              <div key={label} style={{ display: "flex", flexDirection: "column" }}>
                <div style={{ fontSize: 22, color: "#6A6F85" }}>{label}</div>
                <div style={{ fontSize: 46, color: "#0F1222", fontWeight: 700 }}>{value}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    ),
    OG_SIZE,
  );
}
