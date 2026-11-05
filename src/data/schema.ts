/**
 * The archive's data model, defined once with zod. Used by the app (types), by
 * scripts/import.ts (validation of CSV/JSON imports) and by prisma/seed.ts.
 *
 * Reference fields (team, driver, car, manufacturer) hold either the id of a profiled
 * record or, for entities the archive has not profiled yet, a plain display name.
 * Ids are kebab-case; names contain capitals or spaces, so the two never collide.
 *
 * Kept free of path aliases so Node can run it directly (type stripping).
 */
import { z } from "zod";

export const ClassFamily = z.enum(["hyper", "lmp1", "lmp2", "gt", "hist"]);
export const ClassId = z.enum(["overall", "hypercar", "lmp1", "lmp2", "lmgte-pro", "lmgte-am", "lmgt3", "group-c", "prototype", "gt1"]);

export const Source = z.object({
  id: z.string(),
  title: z.string(),
  publisher: z.string(),
  url: z.string().url().optional(),
  note: z.string().optional(),
});

export const RaceClass = z.object({
  id: ClassId,
  name: z.string(),
  short: z.string(),
  family: ClassFamily,
  from: z.number().int(),
  to: z.number().int().nullable(),
  description: z.string(),
});

export const Championship = z.object({
  id: z.string(),
  name: z.string(),
  short: z.string(),
  from: z.number().int(),
  to: z.number().int().nullable(),
  description: z.string(),
});

export const Era = z.object({
  slug: z.string(),
  name: z.string(),
  short: z.string(),
  from: z.number().int(),
  to: z.number().int().nullable(),
  championshipId: z.string().optional(),
  summary: z.string(),
  hallmarks: z.array(z.string()),
});

export const Manufacturer = z.object({
  id: z.string(),
  name: z.string(),
  country: z.string().length(2),
  summary: z.string(),
  sources: z.array(z.string()).default([]),
});

export const Car = z.object({
  id: z.string(),
  name: z.string(),
  manufacturerId: z.string(),
  classId: ClassId,
  from: z.number().int(),
  to: z.number().int().nullable(),
  powertrain: z.string(),
  summary: z.string(),
  verified: z.boolean().default(false),
  sources: z.array(z.string()).default([]),
});

export const TeamName = z.object({ name: z.string(), from: z.number().int(), to: z.number().int().nullable() });

export const Team = z.object({
  id: z.string(),
  names: z.array(TeamName).min(1),
  country: z.string().length(2),
  status: z.enum(["active", "defunct"]),
  firstSeason: z.number().int(),
  lastSeason: z.number().int().nullable(),
  manufacturerIds: z.array(z.string()),
  tagline: z.string(),
  history: z.object({ founding: z.string(), peak: z.string(), exit: z.string().optional() }),
  whyLeft: z.string().optional(),
  moments: z.array(z.object({ year: z.number().int(), text: z.string() })).default([]),
  verified: z.boolean().default(false),
  sources: z.array(z.string()).default([]),
});

export const Driver = z.object({
  id: z.string(),
  name: z.string(),
  nationality: z.string().length(2),
  birthYear: z.number().int().optional(),
  status: z.enum(["active", "retired"]),
  bio: z.string(),
  verified: z.boolean().default(false),
  sources: z.array(z.string()).default([]),
});

export const TeamSeasonEntry = z.object({
  teamId: z.string(),
  season: z.number().int(),
  classId: ClassId,
  car: z.string(),
  numbers: z.array(z.string()).default([]),
  nameUsed: z.string().optional(),
  note: z.string().optional(),
});

export const DriverSeasonEntry = z.object({
  driverId: z.string(),
  season: z.number().int(),
  team: z.string(),
  classId: ClassId,
  car: z.string(),
  number: z.string().optional(),
  note: z.string().optional(),
});

export const EntryRef = z.object({
  team: z.string(),
  car: z.string(),
  number: z.string().optional(),
  drivers: z.array(z.string()),
});

export const ClassResult = z.object({
  classId: ClassId,
  /** Finishing order from 1st; may hold only the winner while the rest is unverified. */
  podium: z.array(EntryRef),
  pole: EntryRef.optional(),
  fastestLap: z.object({ entry: EntryRef, time: z.string().optional() }).optional(),
  laps: z.number().int().optional(),
  distanceKm: z.number().optional(),
  note: z.string().optional(),
});

export const RaceEvent = z.object({
  id: z.string(),
  season: z.number().int(),
  round: z.number().int(),
  name: z.string(),
  circuit: z.string(),
  country: z.string().length(2),
  /** ISO date of the finish; "YYYY-MM" when the day has not been verified. */
  date: z.string().optional(),
  format: z.string(),
  results: z.array(ClassResult).default([]),
  summary: z.string().optional(),
  verified: z.boolean().default(false),
  sources: z.array(z.string()).default([]),
});

export const StandingRow = z.object({
  pos: z.number().int(),
  /** Driver ids/names for drivers' tables, a team or manufacturer for the others. */
  entrant: z.array(z.string()).min(1),
  car: z.string().optional(),
  points: z.number().optional(),
});

export const Standings = z.object({
  classId: ClassId,
  kind: z.enum(["drivers", "manufacturers", "teams"]),
  rows: z.array(StandingRow),
  complete: z.boolean().default(false),
});

export const Season = z.object({
  /** First calendar year of the season — the URL key. */
  year: z.number().int(),
  /** Display label for seasons spanning two years, e.g. "2018–19". */
  label: z.string().optional(),
  championshipId: z.string().nullable(),
  eraSlug: z.string(),
  status: z.enum(["complete", "in-progress", "le-mans-only", "not-held"]),
  classes: z.array(ClassId),
  rounds: z.number().int().optional(),
  regulations: z.string().optional(),
  regulationChanges: z.array(z.string()).default([]),
  story: z.string().optional(),
  champions: z
    .array(z.object({ classId: ClassId, drivers: z.array(z.string()).optional(), manufacturer: z.string().optional(), team: z.string().optional(), car: z.string().optional() }))
    .default([]),
  standings: z.array(Standings).default([]),
  verified: z.boolean().default(false),
  sources: z.array(z.string()).default([]),
});

export const LeMansWinner = z.object({
  year: z.number().int(),
  car: z.string(),
  manufacturer: z.string(),
  drivers: z.array(z.string()).min(1),
  team: z.string().optional(),
  number: z.string().optional(),
  laps: z.number().int().optional(),
  date: z.string().optional(),
  sources: z.array(z.string()).default([]),
});

export const Story = z.object({
  slug: z.string(),
  title: z.string(),
  dek: z.string(),
  eraSlug: z.string().optional(),
  body: z.string(),
  related: z.array(z.string()).default([]),
});

export const Archive = z.object({
  sources: z.array(Source),
  classes: z.array(RaceClass),
  championships: z.array(Championship),
  eras: z.array(Era),
  manufacturers: z.array(Manufacturer),
  cars: z.array(Car),
  teams: z.array(Team),
  drivers: z.array(Driver),
  teamEntries: z.array(TeamSeasonEntry),
  driverEntries: z.array(DriverSeasonEntry),
  seasons: z.array(Season),
  events: z.array(RaceEvent),
  leMans: z.array(LeMansWinner),
  stories: z.array(Story),
});

/** An import file: any subset of collections, upserted by key. */
export const ArchivePatch = Archive.partial();

export type Source = z.infer<typeof Source>;
export type ClassId = z.infer<typeof ClassId>;
export type ClassFamily = z.infer<typeof ClassFamily>;
export type RaceClass = z.infer<typeof RaceClass>;
export type Championship = z.infer<typeof Championship>;
export type Era = z.infer<typeof Era>;
export type Manufacturer = z.infer<typeof Manufacturer>;
export type Car = z.infer<typeof Car>;
export type Team = z.infer<typeof Team>;
export type Driver = z.infer<typeof Driver>;
export type TeamSeasonEntry = z.infer<typeof TeamSeasonEntry>;
export type DriverSeasonEntry = z.infer<typeof DriverSeasonEntry>;
export type EntryRef = z.infer<typeof EntryRef>;
export type ClassResult = z.infer<typeof ClassResult>;
export type RaceEvent = z.infer<typeof RaceEvent>;
export type Standings = z.infer<typeof Standings>;
export type Season = z.infer<typeof Season>;
export type LeMansWinner = z.infer<typeof LeMansWinner>;
export type Story = z.infer<typeof Story>;
export type Archive = z.infer<typeof Archive>;
export type ArchivePatch = z.infer<typeof ArchivePatch>;
/** Seed authoring type: fields with zod defaults may be omitted. */
export type ArchiveInput = z.input<typeof Archive>;

/** Upsert key for each collection — used by the loader and the import script. */
export const KEYS: { [K in keyof Archive]: (r: Archive[K][number]) => string } = {
  sources: (r) => r.id,
  classes: (r) => r.id,
  championships: (r) => r.id,
  eras: (r) => r.slug,
  manufacturers: (r) => r.id,
  cars: (r) => r.id,
  teams: (r) => r.id,
  drivers: (r) => r.id,
  teamEntries: (r) => `${r.teamId}|${r.season}|${r.classId}|${r.car}`,
  driverEntries: (r) => `${r.driverId}|${r.season}|${r.team}|${r.car}`,
  seasons: (r) => String(r.year),
  events: (r) => r.id,
  leMans: (r) => String(r.year),
  stories: (r) => r.slug,
};

/** Merge an import patch over a base archive, replacing records with the same key. */
export function mergeArchive(base: Archive, patch: ArchivePatch): Archive {
  const out = { ...base } as Archive;
  for (const k of Object.keys(KEYS) as (keyof Archive)[]) {
    const incoming = patch[k];
    if (!incoming?.length) continue;
    const key = KEYS[k] as (r: unknown) => string;
    const map = new Map<string, unknown>((base[k] as unknown[]).map((r) => [key(r), r]));
    for (const r of incoming as unknown[]) map.set(key(r), r);
    (out as Record<string, unknown>)[k] = [...map.values()];
  }
  return out;
}
