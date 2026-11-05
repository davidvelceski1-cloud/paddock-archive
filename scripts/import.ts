/**
 * Import archive data from JSON or CSV into data/archive.json, which the app overlays on
 * the seed (records with the same key replace seed records).
 *
 *   npm run data:import -- data/import/2016.json
 *   npm run data:import -- results.csv --type results
 *   npm run data:import -- drivers.csv --type drivers
 *   npm run data:validate                 # validate seed + current import, no writes
 *
 * JSON files may hold any subset of collections ({ "teams": [...], "events": [...] }).
 * CSV is supported for flat collections: drivers, driverEntries, teamEntries, leMans,
 * sources, and "results" (one row per finishing position, merged into existing events).
 * In CSV, list fields use "|" as a separator (e.g. drivers: "tom-kristensen|allan-mcnish").
 */
import fs from "node:fs";
import path from "node:path";
import { Archive, ArchivePatch, ClassId, mergeArchive, type ArchivePatch as Patch } from "../src/data/schema.ts";
import { seed } from "../src/data/seed/index.ts";

const OUT = path.join(process.cwd(), "data", "archive.json");
const args = process.argv.slice(2);
const check = args.includes("--check");
const typeArg = args.includes("--type") ? args[args.indexOf("--type") + 1] : undefined;
const files = args.filter((a, i) => !a.startsWith("--") && args[i - 1] !== "--type");

function parseCsv(text: string): Record<string, string>[] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') (cell += '"'), i++;
      else if (c === '"') quoted = false;
      else cell += c;
    } else if (c === '"') quoted = true;
    else if (c === ",") row.push(cell), (cell = "");
    else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(cell);
      if (row.some((x) => x !== "")) rows.push(row);
      row = [];
      cell = "";
    } else cell += c;
  }
  row.push(cell);
  if (row.some((x) => x !== "")) rows.push(row);
  const [head, ...body] = rows;
  return body.map((r) => Object.fromEntries(head.map((h, i) => [h.trim(), (r[i] ?? "").trim()])));
}

const list = (s?: string) => (s ? s.split("|").map((x) => x.trim()).filter(Boolean) : []);
const num = (s?: string) => (s === undefined || s === "" ? undefined : Number(s));
const opt = (s?: string) => (s === "" ? undefined : s);

/** Convert CSV rows of one collection into a patch. */
function csvToPatch(type: string, rows: Record<string, string>[], base: Archive): Patch {
  switch (type) {
    case "drivers":
      return { drivers: rows.map((r) => ({ id: r.id, name: r.name, nationality: r.nationality, birthYear: num(r.birthYear), status: r.status as "active" | "retired", bio: r.bio, verified: r.verified === "true", sources: list(r.sources) })) };
    case "driverEntries":
      return { driverEntries: rows.map((r) => ({ driverId: r.driverId, season: Number(r.season), team: r.team, classId: r.classId as ClassId, car: r.car, number: opt(r.number), note: opt(r.note) })) };
    case "teamEntries":
      return { teamEntries: rows.map((r) => ({ teamId: r.teamId, season: Number(r.season), classId: r.classId as ClassId, car: r.car, numbers: list(r.numbers), nameUsed: opt(r.nameUsed), note: opt(r.note) })) };
    case "leMans":
      return { leMans: rows.map((r) => ({ year: Number(r.year), car: r.car, manufacturer: r.manufacturer, drivers: list(r.drivers), team: opt(r.team), number: opt(r.number), laps: num(r.laps), date: opt(r.date), sources: list(r.sources) })) };
    case "sources":
      return { sources: rows.map((r) => ({ id: r.id, title: r.title, publisher: r.publisher, url: opt(r.url), note: opt(r.note) })) };
    case "results": {
      // eventId,classId,pos,team,car,number,drivers[,laps,pole]
      const events = new Map(base.events.map((e) => [e.id, structuredClone(e)]));
      const touched = new Set<string>();
      for (const r of rows) {
        const e = events.get(r.eventId);
        if (!e) throw new Error(`results.csv: unknown event "${r.eventId}" — import the event first (JSON).`);
        if (!touched.has(e.id)) {
          e.results = [];
          touched.add(e.id);
        }
        let cr = e.results.find((x) => x.classId === r.classId);
        if (!cr) e.results.push((cr = { classId: r.classId as ClassId, podium: [] }));
        const entry = { team: r.team, car: r.car, number: opt(r.number), drivers: list(r.drivers) };
        if (r.pole === "true") cr.pole = entry;
        if (r.pos) cr.podium[Number(r.pos) - 1] = entry;
        if (r.laps && r.pos === "1") cr.laps = Number(r.laps);
      }
      for (const id of touched) {
        const e = events.get(id)!;
        for (const cr of e.results) if (cr.podium.some((p) => !p)) throw new Error(`results.csv: ${id} ${cr.classId} has a gap in positions.`);
      }
      return { events: [...touched].map((id) => events.get(id)!) };
    }
    default:
      throw new Error(`Unsupported CSV --type "${type}". Use JSON for teams, cars, seasons, events and stories.`);
  }
}

/** Reference checks: ids must point at real records; plain names are allowed for unprofiled entities. */
function integrity(a: Archive) {
  const errors: string[] = [];
  const isId = (s: string) => /^[a-z0-9]+(-[a-z0-9]+)*$/.test(s);
  const has = { team: new Set(a.teams.map((t) => t.id)), driver: new Set(a.drivers.map((d) => d.id)), car: new Set(a.cars.map((c) => c.id)), maker: new Set(a.manufacturers.map((m) => m.id)), season: new Set(a.seasons.map((s) => s.year)), source: new Set(a.sources.map((s) => s.id)), era: new Set(a.eras.map((e) => e.slug)) };
  const ref = (kind: keyof typeof has, v: string | number, where: string) => {
    if (typeof v === "string" && !isId(v)) return; // display name for an unprofiled entity
    if (!(has[kind] as Set<string | number>).has(v)) errors.push(`${where}: unknown ${kind} "${v}"`);
  };
  for (const c of a.cars) ref("maker", c.manufacturerId, `car ${c.id}`);
  for (const t of a.teams) t.manufacturerIds.forEach((m) => ref("maker", m, `team ${t.id}`));
  for (const e of a.teamEntries) (ref("team", e.teamId, `teamEntry ${e.teamId}/${e.season}`), ref("car", e.car, `teamEntry ${e.teamId}/${e.season}`));
  for (const e of a.driverEntries) (ref("driver", e.driverId, `driverEntry ${e.driverId}/${e.season}`), ref("team", e.team, `driverEntry ${e.driverId}/${e.season}`), ref("car", e.car, `driverEntry ${e.driverId}/${e.season}`), ref("season", e.season, `driverEntry ${e.driverId}`));
  for (const s of a.seasons) {
    ref("era", s.eraSlug, `season ${s.year}`);
    for (const c of s.champions) (c.drivers ?? []).forEach((d) => ref("driver", d, `season ${s.year} champions`));
  }
  for (const ev of a.events) {
    ref("season", ev.season, `event ${ev.id}`);
    if (!ev.id.startsWith(`${ev.season}-`)) errors.push(`event ${ev.id}: id must start with "${ev.season}-"`);
    for (const r of ev.results)
      for (const p of [...r.podium, ...(r.pole ? [r.pole] : [])]) (ref("team", p.team, `event ${ev.id}`), ref("car", p.car, `event ${ev.id}`), p.drivers.forEach((d) => ref("driver", d, `event ${ev.id}`)));
  }
  for (const l of a.leMans) (ref("car", l.car, `leMans ${l.year}`), ref("maker", l.manufacturer, `leMans ${l.year}`), l.drivers.forEach((d) => ref("driver", d, `leMans ${l.year}`)), l.team && ref("team", l.team, `leMans ${l.year}`));
  const allSources = [...a.teams, ...a.drivers, ...a.cars, ...a.seasons, ...a.events, ...a.leMans, ...a.manufacturers].flatMap((r) => r.sources);
  for (const s of new Set(allSources)) if (!has.source.has(s)) errors.push(`unknown source "${s}"`);
  return errors;
}

const base = Archive.parse(seed);
let current: Patch = fs.existsSync(OUT) ? ArchivePatch.parse(JSON.parse(fs.readFileSync(OUT, "utf8"))) : {};

for (const file of files) {
  const text = fs.readFileSync(file, "utf8");
  const patch: Patch = file.toLowerCase().endsWith(".csv")
    ? csvToPatch(typeArg ?? path.basename(file, ".csv"), parseCsv(text), mergeArchive(base, current))
    : ArchivePatch.parse(JSON.parse(text));
  // Merge the new patch into the stored patch (by key), so imports accumulate.
  current = mergeArchive({ ...Object.fromEntries(Object.keys(Archive.shape).map((k) => [k, []])), ...current } as Archive, patch);
  console.log(`✓ ${file}: ${Object.entries(patch).map(([k, v]) => `${(v as unknown[]).length} ${k}`).join(", ")}`);
}

const merged = Archive.parse(mergeArchive(base, current));
const errors = integrity(merged);
if (errors.length) {
  console.error(`✗ ${errors.length} reference error(s):\n  ${errors.slice(0, 40).join("\n  ")}`);
  process.exit(1);
}
console.log(`✓ Archive valid: ${merged.seasons.length} seasons, ${merged.events.length} events, ${merged.teams.length} teams, ${merged.drivers.length} drivers, ${merged.cars.length} cars, ${merged.leMans.length} Le Mans winners.`);

if (!check && files.length) {
  const compact = Object.fromEntries(Object.entries(current).filter(([, v]) => (v as unknown[]).length));
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(compact, null, 2) + "\n");
  console.log(`✓ Wrote ${path.relative(process.cwd(), OUT)} — restart or rebuild the app to see the changes.`);
}
