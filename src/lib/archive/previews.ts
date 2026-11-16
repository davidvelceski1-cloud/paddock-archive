import "server-only";
import type { Photo, TeamSeasonEntry } from "@/data/schema";
import { countryName } from "@/data/countries";
import {
  archive,
  chassisOf,
  className,
  href,
  ix,
  leMansForSeason,
  photoKey,
  photoOf,
  resolveCar,
  resolveDriver,
  resolveTeam,
  seasonLabel,
  teamDisplayName,
  trackOfCircuit,
} from "@/lib/archive/data";
import { carStats, driverStats, teamStats } from "@/lib/archive/stats";
import { listJoin } from "@/lib/utils";

/** The small card shown when hovering a link to a driver, car, team, season, race or track. */
export type Preview = {
  kind: "driver" | "car" | "team" | "season" | "race" | "track";
  title: string;
  subtitle?: string;
  image?: { src: string; alt: string; credit: string };
  /** Small round inset: a driver's portrait or a track map. */
  inset?: { src: string; alt: string; round?: boolean };
  facts: [string, string][];
  /** "Drivers" line under the facts. */
  people?: string;
};

const img = (p?: Photo) => (p ? { src: p.src, alt: p.alt, credit: `${p.credit} · ${p.license}` } : undefined);
/** That season's photo of the entry, else the car's general photo. */
const entryImage = (teamId: string, season: number, car: string) => img(photoOf(photoKey.entry({ teamId, season, car }))) ?? img(photoOf(photoKey.car(car)));
const names = (refs: string[]) => listJoin(refs.map((r) => resolveDriver(r).label));
const engine = (car: string) => ix().cars.get(car)?.powertrain;
const years = (from: number, to: number | null) => (from === to ? String(from) : `${from}–${to ?? "today"}`);

function driverPreview(id: string): Preview | undefined {
  const d = ix().drivers.get(id);
  if (!d) return;
  const s = driverStats(id);
  const latest = [...s.entries].sort((x, y) => y.season - x.season)[0];
  const teamEntry = latest && archive().teamEntries.find((e) => e.teamId === latest.team && e.season === latest.season && e.car === latest.car);
  const portrait = photoOf(photoKey.driver(id));
  const facts: [string, string][] = [["Nationality", countryName(d.nationality)]];
  if (latest) facts.push([`Car (${seasonLabel(latest.season)})`, teamEntry ? chassisOf(teamEntry) : resolveCar(latest.car).label], ["Team", resolveTeam(latest.team, latest.season).label]);
  if (latest && engine(latest.car)) facts.push(["Engine", engine(latest.car)!]);
  if (s.leMansWins.length) facts.push(["Le Mans wins", s.leMansWins.join(", ")]);
  if (s.titles.length) facts.push(["World titles", s.titles.map(seasonLabel).join(", ")]);
  const crew = latest ? archive().driverEntries.filter((e) => e.season === latest.season && e.team === latest.team && e.car === latest.car && e.number === latest.number && e.driverId !== id) : [];
  return {
    kind: "driver",
    title: d.name,
    subtitle: `${d.status === "active" ? "Active" : "Retired"}${d.birthYear ? ` · born ${d.birthYear}` : ""}`,
    image: latest ? entryImage(latest.team, latest.season, latest.car) ?? img(portrait) : img(portrait),
    inset: portrait ? { src: portrait.src, alt: portrait.alt, round: true } : undefined,
    facts,
    people: crew.length ? `With ${names(crew.map((c) => c.driverId))}` : undefined,
  };
}

function carPreview(id: string): Preview | undefined {
  const c = ix().cars.get(id);
  if (!c) return;
  const s = carStats(id);
  const facts: [string, string][] = [
    ["Class", className(c.classId)],
    ["Raced", years(c.from, c.to)],
    ["Engine", c.powertrain],
  ];
  if (s.leMansWins.length) facts.push(["Le Mans wins", s.leMansWins.join(", ")]);
  if (s.teamIds.length) facts.push(["Teams", listJoin(s.teamIds.slice(0, 3).map((t) => resolveTeam(t).label))]);
  return {
    kind: "car",
    title: c.name,
    subtitle: ix().manufacturers.get(c.manufacturerId)?.name,
    image: img(photoOf(photoKey.car(id))),
    facts,
    people: s.driverIds.length ? `Drivers: ${names(s.driverIds.slice(0, 6))}${s.driverIds.length > 6 ? " and others" : ""}` : undefined,
  };
}

function teamPreview(id: string): Preview | undefined {
  const t = ix().teams.get(id);
  if (!t) return;
  const s = teamStats(id);
  const latest: TeamSeasonEntry | undefined = s.entries[s.entries.length - 1];
  const facts: [string, string][] = [
    ["Country", countryName(t.country)],
    ["Years", years(t.firstSeason, t.lastSeason)],
  ];
  if (latest) facts.push([`Car (${seasonLabel(latest.season)})`, chassisOf(latest)]);
  if (latest && engine(latest.car)) facts.push(["Engine", engine(latest.car)!]);
  if (s.leMansWins.length) facts.push(["Le Mans wins", s.leMansWins.join(", ")]);
  const crew = latest ? [...new Set(archive().driverEntries.filter((e) => e.team === id && e.season === latest.season).map((e) => e.driverId))] : [];
  return {
    kind: "team",
    title: teamDisplayName(t),
    subtitle: t.status === "active" ? "Active" : "Defunct",
    image: img(photoOf(photoKey.team(id))) ?? (latest ? entryImage(latest.teamId, latest.season, latest.car) : undefined),
    facts,
    people: crew.length ? `${seasonLabel(latest!.season)} drivers: ${names(crew)}` : undefined,
  };
}

function seasonPreview(year: number): Preview | undefined {
  const s = ix().seasons.get(year);
  if (!s || s.status === "not-held") return;
  const lm = leMansForSeason(year).at(-1);
  const champ = s.champions.find((c) => c.classId === "hypercar" || c.classId === "lmp1") ?? s.champions[0];
  const facts: [string, string][] = [];
  if (lm) {
    const same = (e: TeamSeasonEntry) => e.teamId === lm.team && e.car === lm.car;
    const entry = lm.team ? (archive().teamEntries.find((e) => same(e) && e.season === year) ?? archive().teamEntries.find((e) => same(e) && e.season === year - 1)) : undefined;
    facts.push([`Le Mans ${lm.year}`, entry ? chassisOf(entry) : resolveCar(lm.car).label]);
    if (lm.team) facts.push(["Winning team", resolveTeam(lm.team, year).label]);
    if (engine(lm.car)) facts.push(["Engine", engine(lm.car)!]);
  }
  if (champ?.drivers?.length) facts.push(["Champions", names(champ.drivers)]);
  if (s.rounds) facts.push(["Rounds", String(s.rounds)]);
  return {
    kind: "season",
    title: `${seasonLabel(year)} season`,
    subtitle: s.championshipId ? ix().championships.get(s.championshipId)?.short : "Le Mans",
    image: lm ? (lm.team ? entryImage(lm.team, year, lm.car) : undefined) ?? img(photoOf(photoKey.car(lm.car))) : undefined,
    facts,
    people: lm ? `Le Mans winners: ${names(lm.drivers)}` : undefined,
  };
}

function racePreview(eventId: string): Preview | undefined {
  const e = ix().events.get(eventId);
  if (!e) return;
  const top = e.results.find((r) => r.classId === "overall")?.podium[0];
  const track = trackOfCircuit(e.circuit);
  const facts: [string, string][] = [["Circuit", e.circuit]];
  if (e.date) facts.push(["Date", e.date]);
  if (top) {
    facts.push(["Winner", `#${top.number ?? "?"} ${resolveTeam(top.team, e.season).label}`]);
    const entry = archive().teamEntries.find((x) => x.teamId === top.team && x.season === e.season && x.car === top.car);
    facts.push(["Car", entry ? chassisOf(entry) : resolveCar(top.car).label]);
    if (engine(top.car)) facts.push(["Engine", engine(top.car)!]);
  }
  const map = track && photoOf(`trackmap:${track.id}`);
  return {
    kind: "race",
    title: `${seasonLabel(e.season)} ${e.name}`,
    subtitle: e.format,
    image: top ? entryImage(top.team, e.season, top.car) : track ? img(photoOf(`track:${track.id}`)) : undefined,
    inset: map ? { src: map.src, alt: map.alt } : undefined,
    facts,
    people: top ? `Winners: ${names(top.drivers)}` : "Results not yet in the archive",
  };
}

function trackPreview(id: string): Preview | undefined {
  const t = ix().tracks.get(id);
  if (!t) return;
  const map = photoOf(`trackmap:${id}`);
  return {
    kind: "track",
    title: t.name,
    subtitle: `${t.location}, ${countryName(t.country)}`,
    image: img(photoOf(`track:${id}`)) ?? img(map),
    inset: map ? { src: map.src, alt: map.alt } : undefined,
    facts: [
      ["Length", `${t.lengthKm.toFixed(3)} km`],
      ["Corners", String(t.turns)],
      ["Opened", String(t.opened)],
      ["Endurance racing", t.usage],
      ...(t.lapRecord ? ([["Lap record", t.lapRecord]] as [string, string][]) : []),
    ],
  };
}

/** Every preview, keyed by the page path it describes. */
export function allPreviews(): Record<string, Preview> {
  const a = archive();
  const out: Record<string, Preview> = {};
  const put = (path: string, p?: Preview) => p && (out[path] = p);
  for (const d of a.drivers) put(href.driver(d.id), driverPreview(d.id));
  for (const c of a.cars) put(href.car(c.id), carPreview(c.id));
  for (const t of a.teams) put(href.team(t.id), teamPreview(t.id));
  for (const s of a.seasons) put(href.season(s.year), seasonPreview(s.year));
  for (const e of a.events) put(href.event(e.id), racePreview(e.id));
  for (const t of a.tracks) put(href.track(t.id), trackPreview(t.id));
  return out;
}
