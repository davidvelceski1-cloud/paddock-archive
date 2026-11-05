import "server-only";
import type { TimelineRow } from "@/components/archive/CareerTimeline";
import { archive, className, classFamily, href, ix, resolveCar, resolveTeam, seasonLabel, seasonOfLeMans } from "./data";

/** Team career: one row per season, one segment per class/car entry. */
export function teamTimeline(id: string): TimelineRow[] {
  const rows = new Map<number, TimelineRow>();
  for (const e of archive().teamEntries.filter((x) => x.teamId === id)) {
    const row = rows.get(e.season) ?? { year: e.season, label: seasonLabel(e.season), href: ix().seasons.has(e.season) ? href.season(e.season) : undefined, segments: [] };
    const car = resolveCar(e.car);
    row.segments.push({
      family: classFamily(e.classId),
      classLabel: className(e.classId),
      title: car.label,
      href: car.href,
      sub: [e.numbers.length ? `#${e.numbers.join(", #")}` : "", e.nameUsed ?? "", e.note ?? ""].filter(Boolean).join(" · ") || undefined,
    });
    rows.set(e.season, row);
  }
  return [...rows.values()].sort((a, b) => a.year - b.year);
}

/** Driver career: season entries, plus Le Mans wins for years with no entry (historic drivers). */
export function driverTimeline(id: string): TimelineRow[] {
  const rows = new Map<number, TimelineRow>();
  const a = archive();
  for (const e of a.driverEntries.filter((x) => x.driverId === id)) {
    const row = rows.get(e.season) ?? { year: e.season, label: seasonLabel(e.season), href: href.season(e.season), segments: [] };
    const team = resolveTeam(e.team, e.season);
    row.segments.push({ family: classFamily(e.classId), classLabel: className(e.classId), title: team.label, href: team.href, sub: [resolveCar(e.car).label, e.number ? `#${e.number}` : "", e.note ?? ""].filter(Boolean).join(" · ") });
    rows.set(e.season, row);
  }
  for (const l of a.leMans.filter((x) => x.drivers.includes(id))) {
    const key = seasonOfLeMans(l.year) ?? l.year;
    if (rows.has(key)) continue;
    const cls = ix().cars.get(l.car)?.classId ?? (l.year <= 1981 ? "prototype" : l.year <= 1992 ? "group-c" : "lmp1");
    rows.set(key, {
      year: key,
      label: seasonLabel(key),
      href: ix().seasons.has(key) ? href.season(key) : undefined,
      segments: [{ family: classFamily(cls), classLabel: "Le Mans win", title: resolveCar(l.car).label, href: resolveCar(l.car).href, sub: l.team ? resolveTeam(l.team).label : undefined }],
    });
  }
  return [...rows.values()].sort((x, y) => x.year - y.year);
}
