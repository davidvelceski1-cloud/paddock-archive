import "server-only";
import fs from "node:fs";
import path from "node:path";
import { Archive, ArchivePatch, mergeArchive, type ClassId, type EntryRef, type Team } from "@/data/schema";
import { seed } from "@/data/seed";

/**
 * The archive = validated seed data, overlaid with anything imported through
 * `npm run data:import` (data/archive.json). Records with the same key are replaced.
 */
function load(): Archive {
  const base = Archive.parse(seed);
  const file = path.join(process.cwd(), "data", "archive.json");
  if (!fs.existsSync(file)) return base;
  const patch = ArchivePatch.parse(JSON.parse(fs.readFileSync(file, "utf8")));
  return mergeArchive(base, patch);
}

let cached: Archive | null = null;
export const archive = () => (cached ??= load());

// ───────────── Indexes ─────────────
type Indexes = ReturnType<typeof buildIndexes>;
function buildIndexes(a: Archive) {
  const by = <T, K extends string | number>(rows: T[], key: (r: T) => K) => new Map(rows.map((r) => [key(r), r]));
  return {
    teams: by(a.teams, (t) => t.id),
    drivers: by(a.drivers, (d) => d.id),
    cars: by(a.cars, (c) => c.id),
    manufacturers: by(a.manufacturers, (m) => m.id),
    seasons: by(a.seasons, (s) => s.year),
    events: by(a.events, (e) => e.id),
    classes: by(a.classes, (c) => c.id),
    eras: by(a.eras, (e) => e.slug),
    championships: by(a.championships, (c) => c.id),
    sources: by(a.sources, (s) => s.id),
    stories: by(a.stories, (s) => s.slug),
    leMans: by(a.leMans, (l) => l.year),
  };
}
let idx: Indexes | null = null;
export const ix = () => (idx ??= buildIndexes(archive()));

// ───────────── URLs ─────────────
export const href = {
  season: (year: number) => `/seasons/${year}`,
  event: (id: string) => {
    const [year, ...slug] = id.split("-");
    return `/seasons/${year}/${slug.join("-")}`;
  },
  team: (id: string) => `/teams/${id}`,
  driver: (id: string) => `/drivers/${id}`,
  car: (id: string) => `/cars/${id}`,
  manufacturer: (id: string) => `/manufacturers/${id}`,
  story: (slug: string) => `/stories/${slug}`,
  era: (slug: string) => `/seasons?era=${slug}`,
};

// ───────────── Seasons ─────────────
export const seasonLabel = (year: number) => ix().seasons.get(year)?.label ?? String(year);
/** Last calendar year a season touches (2018 → 2019 for "2018–19"). */
export const seasonEndYear = (year: number) => {
  const label = ix().seasons.get(year)?.label;
  return label ? Number(label.slice(0, 2) + label.slice(-2)) : year;
};
export const latestSeason = () => Math.max(...archive().seasons.filter((s) => s.status === "complete").map((s) => s.year));
export const currentSeason = () => Math.max(...archive().seasons.map((s) => s.year));

export const eventsForSeason = (year: number) =>
  archive()
    .events.filter((e) => e.season === year)
    .sort((a, b) => a.round - b.round);

export const eventSlug = (id: string) => id.split("-").slice(1).join("-");

// ───────────── Reference resolution ─────────────
// Reference fields hold an id when the entity is profiled, otherwise a display name.
export type Resolved = { label: string; href?: string };

export function teamNameIn(team: Team, season?: number) {
  if (season === undefined) return team.names[team.names.length - 1].name;
  const hit = team.names.find((n) => season >= n.from && (n.to === null || season <= n.to));
  return hit?.name ?? team.names[team.names.length - 1].name;
}
export const teamDisplayName = (team: Team) => team.names[team.names.length - 1].name;

export function resolveTeam(ref: string, season?: number): Resolved {
  const t = ix().teams.get(ref);
  return t ? { label: teamNameIn(t, season), href: href.team(t.id) } : { label: ref };
}
export function resolveDriver(ref: string): Resolved {
  const d = ix().drivers.get(ref);
  return d ? { label: d.name, href: href.driver(d.id) } : { label: ref };
}
export function resolveCar(ref: string): Resolved {
  const c = ix().cars.get(ref);
  return c ? { label: c.name, href: href.car(c.id) } : { label: ref };
}
export function resolveManufacturer(ref: string): Resolved {
  const m = ix().manufacturers.get(ref);
  return m ? { label: m.name, href: href.manufacturer(m.id) } : { label: ref };
}
/** Standings entrants are drivers, teams or manufacturers depending on the table. */
export function resolveAny(ref: string, season?: number): Resolved {
  if (ix().drivers.has(ref)) return resolveDriver(ref);
  if (ix().teams.has(ref)) return resolveTeam(ref, season);
  if (ix().manufacturers.has(ref)) return resolveManufacturer(ref);
  return { label: ref };
}

export const className = (id: ClassId) => ix().classes.get(id)?.name ?? id;
export const classFamily = (id: ClassId) => ix().classes.get(id)?.family ?? "hist";

export const entryLabel = (e: EntryRef) => `#${e.number ?? "?"} ${resolveTeam(e.team).label}`;

// ───────────── Le Mans ─────────────
export const leMansWinner = (calendarYear: number) => ix().leMans.get(calendarYear);
/** Le Mans races belonging to a season key (2018–19 holds two). */
export const leMansForSeason = (year: number) => {
  const end = seasonEndYear(year);
  const label = ix().seasons.get(year)?.label;
  // Split seasons hold the Le Mans of their end year (and 2018–19 also June 2018).
  const years = label ? (year === 2018 ? [2018, 2019] : [end]) : [year];
  return years.map((y) => ix().leMans.get(y)).filter((x) => !!x);
};
/** The season key whose calendar includes a given Le Mans (2020 → 2019, i.e. 2019–20). */
export const seasonOfLeMans = (calendarYear: number) =>
  calendarYear === 2019 ? 2018 : calendarYear === 2020 ? 2019 : ix().seasons.has(calendarYear) ? calendarYear : undefined;
