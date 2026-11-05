"use client";

import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const VARS = ["--series-1", "--series-2", "--series-3", "--grid", "--axis", "--muted-strong", "--ink", "--surface", "--border", "--body"] as const;

/** Reads chart tokens from CSS so the chart follows light/dark mode. */
function useTokens() {
  const [t, setT] = useState<Record<string, string> | null>(null);
  useEffect(() => {
    const read = () => {
      const cs = getComputedStyle(document.documentElement);
      setT(Object.fromEntries(VARS.map((v) => [v, cs.getPropertyValue(v).trim()])));
    };
    read();
    const obs = new MutationObserver(read);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);
  return t;
}

export type CompareDatum = { stat: string } & Record<string, number | string>;

/**
 * Grouped bars: one group per stat, one bar per compared entity. Series colour follows the
 * entity's slot (1st, 2nd, 3rd pick), never its rank.
 */
export function CompareChart({ data, series, title }: { data: CompareDatum[]; series: { key: string; label: string }[]; title: string }) {
  const t = useTokens();
  if (!t) return <div className="skeleton h-72" aria-hidden />;
  const colors = [t["--series-1"], t["--series-2"], t["--series-3"]];
  return (
    <figure className="card p-5">
      <figcaption className="mb-4 text-sm font-medium text-ink">{title}</figcaption>
      <div className="h-72" role="img" aria-label={`${title}. The same values are listed in the table above.`}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barGap={2} barCategoryGap="28%" margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
            <CartesianGrid vertical={false} stroke={t["--grid"]} />
            <XAxis dataKey="stat" tickLine={false} axisLine={{ stroke: t["--axis"] }} tick={{ fill: t["--muted-strong"], fontSize: 12 }} />
            <YAxis allowDecimals={false} tickLine={false} axisLine={false} tick={{ fill: t["--muted-strong"], fontSize: 12 }} />
            <Tooltip
              cursor={{ fill: t["--grid"], opacity: 0.5 }}
              contentStyle={{ background: t["--surface"], border: `1px solid ${t["--border"]}`, borderRadius: 10, fontSize: 12, color: t["--body"] }}
              labelStyle={{ color: t["--ink"], fontWeight: 600, marginBottom: 4 }}
              itemStyle={{ color: t["--body"], padding: 0 }}
            />
            {series.map((s, i) => (
              <Bar key={s.key} dataKey={s.key} name={s.label} fill={colors[i]} radius={[4, 4, 0, 0]} maxBarSize={28} stroke={t["--surface"]} strokeWidth={1} isAnimationActive={false} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
      {/* Legend in pick order (Recharts sorts its own legend alphabetically). */}
      <ul className="mt-3 flex flex-wrap justify-center gap-x-5 gap-y-1 text-xs text-body">
        {series.map((s, i) => (
          <li key={s.key} className="flex items-center gap-1.5">
            <span className="size-2 rounded-full" style={{ background: colors[i] }} aria-hidden />
            {s.label}
          </li>
        ))}
      </ul>
    </figure>
  );
}
