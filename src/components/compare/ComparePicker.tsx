"use client";

import { useRouter } from "next/navigation";

/** Up to three selectors; every change rewrites the shareable URL (?type=…&ids=a,b,c). */
export function ComparePicker({ type, ids, options }: { type: string; ids: string[]; options: { value: string; label: string }[] }) {
  const router = useRouter();
  const set = (slot: number, value: string) => {
    const next = [...ids];
    if (value) next[slot] = value;
    else next.splice(slot, 1);
    const clean = [...new Set(next.filter(Boolean))].slice(0, 3);
    router.push(`/compare?type=${type}${clean.length ? `&ids=${clean.join(",")}` : ""}`, { scroll: false });
  };
  const slots = Math.min(3, Math.max(2, ids.length + 1));
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {Array.from({ length: slots }, (_, i) => (
        <label key={i} className="block">
          <span className="mb-1 flex items-center gap-2 text-xs font-medium text-muted-strong">
            <span className="size-2.5 rounded-full" style={{ background: `var(--series-${i + 1})` }} aria-hidden />
            {i === 2 ? "Third (optional)" : i === 0 ? "First" : "Second"}
          </span>
          <select
            value={ids[i] ?? ""}
            onChange={(e) => set(i, e.target.value)}
            className="h-10 w-full rounded-xl border border-line-strong bg-surface px-3 text-sm text-ink shadow-card outline-none focus:border-accent/60"
          >
            <option value="">{i < 2 ? "Choose…" : "None"}</option>
            {options.map((o) => (
              <option key={o.value} value={o.value} disabled={ids.includes(o.value) && ids[i] !== o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
      ))}
    </div>
  );
}
