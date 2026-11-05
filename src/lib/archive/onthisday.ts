import "server-only";
import { archive, href, resolveCar, resolveDriver, resolveTeam, seasonLabel, seasonOfLeMans } from "./data";
import { listJoin } from "@/lib/utils";

export type DayItem = { date: string; title: string; detail: string; href: string };

/** Races with an exact (day-precision) date and a known winner. */
function datedItems(): DayItem[] {
  const a = archive();
  const items: DayItem[] = [];
  for (const e of a.events) {
    const w = e.results.find((r) => r.classId === "overall")?.podium[0];
    if (!e.date || e.date.length !== 10 || !w || e.name.includes("Le Mans")) continue;
    items.push({ date: e.date, title: `${seasonLabel(e.season)} ${e.name}`, detail: `Won by ${resolveTeam(w.team, e.season).label} — ${listJoin(w.drivers.map((d) => resolveDriver(d).label))}`, href: href.event(e.id) });
  }
  for (const l of a.leMans) {
    if (!l.date) continue;
    const key = seasonOfLeMans(l.year);
    const ev = a.events.find((e) => e.season === key && e.id.endsWith("le-mans"));
    items.push({ date: l.date, title: `${l.year} 24 Hours of Le Mans`, detail: `${resolveCar(l.car).label} won with ${listJoin(l.drivers.map((d) => resolveDriver(d).label))}`, href: ev ? href.event(ev.id) : "/le-mans" });
  }
  return items;
}

const md = (iso: string) => iso.slice(5);

/** Exact anniversaries of today, or else the next anniversary coming up. */
export function onThisDay(today = new Date()) {
  const items = datedItems();
  const t = today.toISOString().slice(5, 10);
  const exact = items.filter((i) => md(i.date) === t);
  if (exact.length) return { exact: true, items: exact };
  const sorted = [...items].sort((a, b) => md(a.date).localeCompare(md(b.date)));
  const next = sorted.find((i) => md(i.date) > t) ?? sorted[0];
  return { exact: false, items: next ? sorted.filter((i) => md(i.date) === md(next.date)) : [] };
}
