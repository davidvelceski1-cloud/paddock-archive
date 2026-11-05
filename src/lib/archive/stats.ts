import "server-only";
import type { ClassId, EntryRef, RaceEvent } from "@/data/schema";
import { archive, seasonOfLeMans } from "./data";

/**
 * Stats are counted from records in the archive, never stored as totals: a number on a
 * page is always traceable to the rows behind it. Race-level stats (wins, podiums, poles)
 * therefore cover only events whose results are loaded — pages say so next to them.
 */

type RaceHit = { event: RaceEvent; classId: ClassId; pos: number };

function raceHits(match: (e: EntryRef) => boolean) {
  const wins: RaceHit[] = [];
  const podiums: RaceHit[] = [];
  const poles: RaceHit[] = [];
  for (const event of archive().events)
    for (const r of event.results) {
      r.podium.forEach((entry, i) => {
        if (!match(entry)) return;
        const hit = { event, classId: r.classId, pos: i + 1 };
        podiums.push(hit);
        if (i === 0) wins.push(hit);
      });
      if (r.pole && match(r.pole)) poles.push({ event, classId: r.classId, pos: 1 });
    }
  return { wins, podiums, poles };
}

/** Events with any results loaded — the denominator for race-level stats. */
export const coverage = () => {
  const ev = archive().events;
  return { loaded: ev.filter((e) => e.results.length).length, total: ev.length, seasons: [...new Set(ev.map((e) => e.season))].sort() };
};

export function driverStats(id: string) {
  const a = archive();
  const entries = a.driverEntries.filter((e) => e.driverId === id);
  const { wins, podiums, poles } = raceHits((e) => e.drivers.includes(id));
  const leMansWins = a.leMans.filter((l) => l.drivers.includes(id)).map((l) => l.year);
  const titles = a.seasons.filter((s) => s.champions.some((c) => c.drivers?.includes(id))).map((s) => s.year);
  const seasons = [...new Set(entries.map((e) => e.season))].sort((x, y) => x - y);
  return {
    entries,
    seasons,
    teams: [...new Set(entries.map((e) => e.team))],
    cars: [...new Set(entries.map((e) => e.car))],
    wins: wins.filter((w) => w.classId === "overall"),
    classWins: wins.filter((w) => w.classId !== "overall"),
    podiums: podiums.filter((p) => p.classId === "overall"),
    poles: poles.filter((p) => p.classId === "overall"),
    leMansWins,
    titles,
  };
}

export function teamStats(id: string) {
  const a = archive();
  const entries = a.teamEntries.filter((e) => e.teamId === id).sort((x, y) => x.season - y.season);
  const { wins, podiums, poles } = raceHits((e) => e.team === id);
  const titles = a.seasons.filter((s) => s.champions.some((c) => c.team === id)).map((s) => s.year);
  const leMansWins = a.leMans.filter((l) => l.team === id).map((l) => l.year);
  const driverIds = [...new Set(a.driverEntries.filter((e) => e.team === id).map((e) => e.driverId))];
  return {
    entries,
    seasons: [...new Set(entries.map((e) => e.season))],
    cars: [...new Set(entries.map((e) => e.car))],
    driverIds,
    wins: wins.filter((w) => w.classId === "overall"),
    classWins: wins.filter((w) => w.classId !== "overall"),
    podiums: podiums.filter((p) => p.classId === "overall"),
    poles: poles.filter((p) => p.classId === "overall"),
    titles,
    leMansWins,
  };
}

export function manufacturerStats(id: string) {
  const a = archive();
  const cars = a.cars.filter((c) => c.manufacturerId === id).sort((x, y) => x.from - y.from);
  const carIds = new Set(cars.map((c) => c.id));
  const teams = a.teams.filter((t) => t.manufacturerIds.includes(id));
  const leMansWins = a.leMans.filter((l) => l.manufacturer === id).map((l) => l.year);
  const titles = a.seasons.filter((s) => s.champions.some((c) => c.manufacturer === id)).map((s) => s.year);
  const { wins } = raceHits((e) => carIds.has(e.car));
  return { cars, teams, leMansWins, titles, wins: wins.filter((w) => w.classId === "overall") };
}

export function carStats(id: string) {
  const a = archive();
  const teamIds = [...new Set(a.teamEntries.filter((e) => e.car === id).map((e) => e.teamId))];
  const driverIds = [...new Set(a.driverEntries.filter((e) => e.car === id).map((e) => e.driverId))];
  const { wins, podiums } = raceHits((e) => e.car === id);
  const leMansWins = a.leMans.filter((l) => l.car === id).map((l) => l.year);
  return { teamIds, driverIds, wins, podiums, leMansWins };
}

/** Co-drivers: shared a car number in the same season and team, or shared a Le Mans win. */
export function teammates(id: string) {
  const a = archive();
  const mine = a.driverEntries.filter((e) => e.driverId === id);
  const out = new Map<string, Set<number>>();
  const add = (other: string, year: number) => {
    if (other === id) return;
    if (!out.has(other)) out.set(other, new Set());
    out.get(other)!.add(year);
  };
  for (const m of mine)
    for (const e of a.driverEntries) if (e.season === m.season && e.team === m.team && e.number === m.number) add(e.driverId, e.season);
  for (const l of a.leMans) if (l.drivers.includes(id)) l.drivers.forEach((d) => add(d, seasonOfLeMans(l.year) ?? l.year));
  return [...out.entries()].map(([driver, years]) => ({ driver, years: [...years].sort() })).sort((x, y) => y.years.length - x.years.length || x.years[0] - y.years[0]);
}

export function quickStats() {
  const a = archive();
  return {
    seasons: a.seasons.filter((s) => s.status !== "not-held").length,
    teams: a.teams.length,
    drivers: a.drivers.length,
    races: a.events.length + a.leMans.filter((l) => !a.events.some((e) => e.season === seasonOfLeMans(l.year) && e.id.endsWith("le-mans"))).length,
    cars: a.cars.length,
  };
}

/** Classes a profiled team has raced in, in order of first appearance. */
export const teamClasses = (id: string) => [...new Set(archive().teamEntries.filter((e) => e.teamId === id).sort((x, y) => x.season - y.season).map((e) => e.classId))];
