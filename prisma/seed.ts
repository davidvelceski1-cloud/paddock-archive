/**
 * Load the archive (seed + data/archive.json imports) into PostgreSQL.
 *   npm run db:push && npm run db:seed
 * Idempotent: every record is upserted by its natural key.
 */
import fs from "node:fs";
import path from "node:path";
import { PrismaClient } from "@prisma/client";
import { Archive, ArchivePatch, mergeArchive } from "../src/data/schema.ts";
import { seed } from "../src/data/seed/index.ts";

const prisma = new PrismaClient();

function loadArchive(): Archive {
  const base = Archive.parse(seed);
  const file = path.join(process.cwd(), "data", "archive.json");
  return fs.existsSync(file) ? mergeArchive(base, ArchivePatch.parse(JSON.parse(fs.readFileSync(file, "utf8")))) : base;
}

async function main() {
  const a = loadArchive();

  for (const s of a.sources) await prisma.source.upsert({ where: { id: s.id }, create: s, update: s });
  for (const c of a.classes) {
    const data = { name: c.name, short: c.short, family: c.family, fromYear: c.from, toYear: c.to, description: c.description };
    await prisma.raceClass.upsert({ where: { id: c.id }, create: { id: c.id, ...data }, update: data });
  }
  for (const c of a.championships) {
    const data = { name: c.name, short: c.short, fromYear: c.from, toYear: c.to, description: c.description };
    await prisma.championship.upsert({ where: { id: c.id }, create: { id: c.id, ...data }, update: data });
  }
  for (const e of a.eras) {
    const data = { name: e.name, short: e.short, fromYear: e.from, toYear: e.to, championshipId: e.championshipId, summary: e.summary, hallmarks: e.hallmarks };
    await prisma.era.upsert({ where: { slug: e.slug }, create: { slug: e.slug, ...data }, update: data });
  }
  for (const m of a.manufacturers) {
    const data = { name: m.name, country: m.country, summary: m.summary };
    await prisma.manufacturer.upsert({ where: { id: m.id }, create: { id: m.id, ...data }, update: data });
  }
  for (const c of a.cars) {
    const data = { name: c.name, manufacturerId: c.manufacturerId, classId: c.classId, fromYear: c.from, toYear: c.to, powertrain: c.powertrain, summary: c.summary, verified: c.verified };
    await prisma.car.upsert({ where: { id: c.id }, create: { id: c.id, ...data }, update: data });
  }
  for (const t of a.teams) {
    const data = {
      country: t.country,
      status: t.status,
      firstSeason: t.firstSeason,
      lastSeason: t.lastSeason,
      manufacturerIds: t.manufacturerIds,
      tagline: t.tagline,
      founding: t.history.founding,
      peak: t.history.peak,
      exit: t.history.exit,
      whyLeft: t.whyLeft,
      moments: t.moments,
      verified: t.verified,
    };
    await prisma.team.upsert({ where: { id: t.id }, create: { id: t.id, ...data }, update: data });
    await prisma.teamName.deleteMany({ where: { teamId: t.id } });
    await prisma.teamName.createMany({ data: t.names.map((n) => ({ teamId: t.id, name: n.name, fromYear: n.from, toYear: n.to })) });
  }
  for (const d of a.drivers) {
    const data = { name: d.name, nationality: d.nationality, birthYear: d.birthYear, status: d.status, bio: d.bio, verified: d.verified };
    await prisma.driver.upsert({ where: { id: d.id }, create: { id: d.id, ...data }, update: data });
  }
  for (const s of a.seasons) {
    const data = {
      label: s.label,
      championshipId: s.championshipId,
      eraSlug: s.eraSlug,
      status: s.status,
      classes: s.classes,
      rounds: s.rounds,
      regulations: s.regulations,
      regulationChanges: s.regulationChanges,
      story: s.story,
      champions: s.champions,
      standings: s.standings,
      verified: s.verified,
    };
    await prisma.season.upsert({ where: { year: s.year }, create: { year: s.year, ...data }, update: data });
  }
  await prisma.teamSeasonEntry.deleteMany();
  await prisma.teamSeasonEntry.createMany({ data: a.teamEntries.map((e) => ({ teamId: e.teamId, season: e.season, classId: e.classId, carRef: e.car, numbers: e.numbers, nameUsed: e.nameUsed, note: e.note })) });
  await prisma.driverSeasonEntry.deleteMany();
  await prisma.driverSeasonEntry.createMany({ data: a.driverEntries.map((e) => ({ driverId: e.driverId, season: e.season, teamRef: e.team, classId: e.classId, carRef: e.car, number: e.number, note: e.note })) });

  for (const ev of a.events) {
    const data = { season: ev.season, round: ev.round, name: ev.name, circuit: ev.circuit, country: ev.country, date: ev.date, format: ev.format, summary: ev.summary, verified: ev.verified };
    await prisma.event.upsert({ where: { id: ev.id }, create: { id: ev.id, ...data }, update: data });
    await prisma.result.deleteMany({ where: { eventId: ev.id } });
    await prisma.result.createMany({
      data: ev.results.flatMap((r) => [
        ...r.podium.map((p, i) => ({ eventId: ev.id, classId: r.classId, kind: "finish", position: i + 1, teamRef: p.team, carRef: p.car, carNumber: p.number, driverRefs: p.drivers, laps: i === 0 ? r.laps : undefined, note: i === 0 ? r.note : undefined })),
        ...(r.pole ? [{ eventId: ev.id, classId: r.classId, kind: "pole", teamRef: r.pole.team, carRef: r.pole.car, carNumber: r.pole.number, driverRefs: r.pole.drivers }] : []),
      ]),
    });
  }
  for (const l of a.leMans) {
    const data = { carRef: l.car, manufacturer: l.manufacturer, driverRefs: l.drivers, teamRef: l.team, carNumber: l.number, laps: l.laps, date: l.date };
    await prisma.leMansWinner.upsert({ where: { year: l.year }, create: { year: l.year, ...data }, update: data });
  }
  for (const s of a.stories) {
    const data = { title: s.title, dek: s.dek, eraSlug: s.eraSlug, body: s.body, related: s.related };
    await prisma.story.upsert({ where: { slug: s.slug }, create: { slug: s.slug, ...data }, update: data });
  }

  // Citations for every sourced record.
  await prisma.citation.deleteMany();
  const cite = (entityType: string, entityId: string | number, ids: string[]) => ids.map((sourceId) => ({ sourceId, entityType, entityId: String(entityId) }));
  await prisma.citation.createMany({
    data: [
      ...a.teams.flatMap((t) => cite("team", t.id, t.sources)),
      ...a.drivers.flatMap((d) => cite("driver", d.id, d.sources)),
      ...a.cars.flatMap((c) => cite("car", c.id, c.sources)),
      ...a.seasons.flatMap((s) => cite("season", s.year, s.sources)),
      ...a.events.flatMap((e) => cite("event", e.id, e.sources)),
      ...a.leMans.flatMap((l) => cite("leMans", l.year, l.sources)),
      ...a.manufacturers.flatMap((m) => cite("manufacturer", m.id, m.sources)),
    ],
    skipDuplicates: true,
  });

  console.log(`Seeded ${a.seasons.length} seasons, ${a.events.length} events, ${a.teams.length} teams, ${a.drivers.length} drivers.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
