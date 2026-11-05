import Link from "next/link";
import type { ClassFamily } from "@/data/schema";
import { cn } from "@/lib/utils";

export type TimelineSegment = { family: ClassFamily; classLabel: string; title: string; sub?: string; href?: string };
export type TimelineRow = { year: number; label: string; href?: string; segments: TimelineSegment[] };

type Col = { kind: "season"; row: TimelineRow } | { kind: "empty"; year: number } | { kind: "gap"; from: number; to: number };

/** Lay seasons out on a continuous axis; long absences collapse into one "gap" column. */
function columns(rows: TimelineRow[]): Col[] {
  const byYear = new Map(rows.map((r) => [r.year, r]));
  const years = rows.map((r) => r.year).sort((a, b) => a - b);
  const out: Col[] = [];
  for (let i = 0; i < years.length; i++) {
    out.push({ kind: "season", row: byYear.get(years[i])! });
    const next = years[i + 1];
    if (next === undefined) break;
    const missing = next - years[i] - 1;
    // Split seasons (2018–19, 2019–20) skip a calendar year without being a gap.
    if (missing === 1 && years[i] === 2019 && next === 2021) continue;
    if (missing > 3) out.push({ kind: "gap", from: years[i] + 1, to: next - 1 });
    else for (let y = years[i] + 1; y < next; y++) out.push({ kind: "empty", year: y });
  }
  return out;
}

function Segment({ s, label }: { s: TimelineSegment; label: string }) {
  const body = (
    <span
      className="block h-full w-full rounded-[3px] transition-transform duration-150 group-hover/seg:scale-y-110"
      style={{ background: `var(--${s.family}-bar)` }}
      aria-hidden
    />
  );
  const tip = `${label} · ${s.classLabel} · ${s.title}${s.sub ? ` · ${s.sub}` : ""}`;
  return (
    <span className="group/seg relative block h-3">
      {s.href ? (
        <Link href={s.href} aria-label={tip} className="block h-full rounded-[3px]">
          {body}
        </Link>
      ) : (
        <span tabIndex={0} aria-label={tip} className="block h-full rounded-[3px]">
          {body}
        </span>
      )}
      <span
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 hidden w-max max-w-56 -translate-x-1/2 rounded-lg border border-line bg-surface px-2.5 py-1.5 text-xs text-body shadow-lift group-focus-within/seg:block group-hover/seg:block"
      >
        <span className="block font-medium text-ink">
          {label} · {s.classLabel}
        </span>
        {s.title}
        {s.sub && <span className="block text-muted-strong">{s.sub}</span>}
      </span>
    </span>
  );
}

/**
 * Career timeline: a horizontal strip of seasons with class-coloured segments and hover
 * tooltips on wide screens; a vertical list on mobile.
 */
export function CareerTimeline({ rows, title }: { rows: TimelineRow[]; title: string }) {
  if (!rows.length) return null;
  const cols = columns(rows);
  const families = [...new Map(rows.flatMap((r) => r.segments).map((s) => [s.family + s.classLabel, s])).values()];
  return (
    <figure aria-label={title}>
      {/* Horizontal (md and up) */}
      <div className="card hidden p-5 md:block">
        <div className="flex items-end gap-1">
          {cols.map((c, i) =>
            c.kind === "season" ? (
              <div key={i} className="flex min-w-0 flex-1 flex-col items-stretch gap-1">
                <div className="flex flex-col gap-0.5">
                  {c.row.segments.map((s, j) => (
                    <Segment key={j} s={s} label={c.row.label} />
                  ))}
                </div>
                <span className="tnum mt-1 truncate text-center text-[10px] text-muted-strong">{c.row.href ? <Link href={c.row.href} className="hover:text-ink">{shortYear(c.row.label)}</Link> : shortYear(c.row.label)}</span>
              </div>
            ) : c.kind === "empty" ? (
              <div key={i} className="flex min-w-0 flex-1 flex-col gap-1" aria-hidden>
                <span className="block h-3 rounded-[3px] border border-dashed border-line" />
                <span className="tnum mt-1 text-center text-[10px] text-muted">{String(c.year).slice(2)}</span>
              </div>
            ) : (
              <div key={i} className="flex w-10 shrink-0 flex-col gap-1" title={`No entries ${c.from}–${c.to}`}>
                <span className="block h-3 text-center text-xs leading-3 text-muted">⋯</span>
                <span className="tnum mt-1 text-center text-[10px] text-muted-strong">
                  {c.from}–{String(c.to).slice(2)}
                </span>
              </div>
            ),
          )}
        </div>
        <Legend items={families} />
      </div>

      {/* Vertical (mobile) */}
      <ol className="card divide-y divide-line md:hidden">
        {rows.map((r) => (
          <li key={r.year} className="flex gap-3 px-4 py-3">
            <span className="tnum w-14 shrink-0 text-sm font-medium text-ink">{r.href ? <Link href={r.href}>{r.label}</Link> : r.label}</span>
            <ul className="min-w-0 flex-1 space-y-1.5">
              {r.segments.map((s, j) => (
                <li key={j} className="flex items-start gap-2 text-sm">
                  <span className="mt-1.5 h-2 w-4 shrink-0 rounded-sm" style={{ background: `var(--${s.family}-bar)` }} aria-hidden />
                  <span className="min-w-0">
                    <span className="text-muted-strong">{s.classLabel} · </span>
                    {s.href ? (
                      <Link href={s.href} className="text-ink hover:underline">
                        {s.title}
                      </Link>
                    ) : (
                      <span className="text-ink">{s.title}</span>
                    )}
                    {s.sub && <span className="block text-xs text-muted-strong">{s.sub}</span>}
                  </span>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </figure>
  );
}

const shortYear = (label: string) => (label.length > 4 ? `${label.slice(2, 4)}–${label.slice(-2)}` : `'${label.slice(2)}`);

function Legend({ items }: { items: TimelineSegment[] }) {
  return (
    <ul className={cn("mt-4 flex flex-wrap gap-x-4 gap-y-1 border-t border-line pt-3 text-xs text-body")}>
      {items.map((s) => (
        <li key={s.family + s.classLabel} className="flex items-center gap-1.5">
          <span className="h-2 w-3 rounded-sm" style={{ background: `var(--${s.family}-bar)` }} aria-hidden />
          {s.classLabel}
        </li>
      ))}
    </ul>
  );
}
