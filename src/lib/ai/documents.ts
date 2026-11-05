import "server-only";
import { countryName } from "@/data/countries";
import {
  archive,
  className,
  href,
  ix,
  leMansForSeason,
  resolveAny,
  resolveCar,
  resolveDriver,
  resolveManufacturer,
  resolveTeam,
  seasonLabel,
  teamDisplayName,
} from "@/lib/archive/data";
import { carStats, driverStats, manufacturerStats, teamStats, teammates } from "@/lib/archive/stats";
import { fmtDate, listJoin } from "@/lib/utils";
import type { EntryRef } from "@/data/schema";

/**
 * The retrieval corpus: one plain-text passage per archive page, written from the same
 * records the pages render. The assistant may only cite these, so every answer traces
 * back to a page a reader can open.
 */
export type Doc = { id: string; kind: string; title: string; href: string; text: string };

const names = (refs: string[]) => listJoin(refs.map((r) => resolveDriver(r).label));
const crew = (e: EntryRef, season?: number) => `#${e.number ?? "?"} ${resolveTeam(e.team, season).label} (${resolveCar(e.car).label}; ${names(e.drivers)})`;
const stripLinks = (md: string) => md.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
const years = (ys: number[]) => (ys.length ? ys.map(seasonLabel).join(", ") : "none recorded");

function teamDoc(id: string): Doc {
  const t = ix().teams.get(id)!;
  const s = teamStats(id);
  const lines = [
    `${teamDisplayName(t)} — ${t.tagline}`,
    `Country: ${countryName(t.country)}. Status: ${t.status === "active" ? "active" : `defunct (last season ${seasonLabel(t.lastSeason!)})`}. First season in archive: ${t.firstSeason}.`,
    `Names used: ${t.names.map((n) => `${n.name} (${n.from}–${n.to ?? "present"})`).join("; ")}.`,
    `Season entries: ${s.entries.map((e) => `${seasonLabel(e.season)} ${className(e.classId)} with ${resolveCar(e.car).label}${e.numbers.length ? ` (#${e.numbers.join(", #")})` : ""}`).join("; ")}.`,
    `World drivers' titles won by the team's crews: ${years(s.titles)}. Le Mans overall wins in archive: ${years(s.leMansWins)}.`,
    `Recorded overall race wins (loaded events only): ${s.wins.length ? s.wins.map((w) => `${seasonLabel(w.event.season)} ${w.event.name}`).join(", ") : "none loaded"}.`,
    `Drivers: ${s.driverIds.map((d) => resolveDriver(d).label).join(", ") || "not yet in archive"}.`,
    `History — founding: ${t.history.founding}`,
    `Peak: ${t.history.peak}`,
    t.history.exit ? `Exit: ${t.history.exit}` : "",
    t.whyLeft ? `Why they left: ${t.whyLeft}` : "",
    ...t.moments.map((m) => `${m.year}: ${m.text}`),
  ];
  return { id: `team:${id}`, kind: "team", title: teamDisplayName(t), href: href.team(id), text: lines.filter(Boolean).join("\n") };
}

function driverDoc(id: string): Doc {
  const d = ix().drivers.get(id)!;
  const s = driverStats(id);
  const mates = teammates(id).slice(0, 10);
  const lines = [
    `${d.name} — ${countryName(d.nationality)}${d.birthYear ? `, born ${d.birthYear}` : ""}. Status: ${d.status === "active" ? "active in the WEC" : "not racing in the WEC"}.`,
    d.bio,
    `Season entries: ${s.entries.length ? s.entries.map((e) => `${seasonLabel(e.season)} ${resolveTeam(e.team, e.season).label} ${resolveCar(e.car).label}${e.number ? ` #${e.number}` : ""}${e.note ? ` (${e.note})` : ""}`).join("; ") : "none in archive"}.`,
    `World titles: ${years(s.titles)}. Le Mans overall wins: ${s.leMansWins.length ? s.leMansWins.join(", ") : "none"}.`,
    `Recorded overall race wins (loaded events only): ${s.wins.length ? s.wins.map((w) => `${seasonLabel(w.event.season)} ${w.event.name}`).join(", ") : "none loaded"}.`,
    mates.length ? `Teammates: ${mates.map((m) => `${resolveDriver(m.driver).label} (${m.years.map(seasonLabel).join(", ")})`).join("; ")}.` : "",
  ];
  return { id: `driver:${id}`, kind: "driver", title: d.name, href: href.driver(id), text: lines.filter(Boolean).join("\n") };
}

function seasonDoc(year: number): Doc {
  const s = ix().seasons.get(year)!;
  const champ = s.championshipId ? ix().championships.get(s.championshipId)?.name : "No world championship (Le Mans only)";
  const lm = leMansForSeason(year);
  const events = archive().events.filter((e) => e.season === year);
  const lines = [
    `${seasonLabel(year)} season — ${champ}. Era: ${ix().eras.get(s.eraSlug)?.name}. Status: ${s.status}.`,
    s.classes.length ? `Classes: ${s.classes.map(className).join(", ")}.` : "",
    s.rounds ? `Rounds: ${s.rounds}.` : "",
    s.regulations ? `Regulations: ${s.regulations}` : "",
    s.regulationChanges.length ? `Changes from the previous year: ${s.regulationChanges.join(" ")}` : "",
    ...s.champions.map((c) => `${className(c.classId)} champions: drivers ${c.drivers ? names(c.drivers) : "—"}; manufacturers' champion ${c.manufacturer ? resolveManufacturer(c.manufacturer).label : "—"}${c.team ? `; champion crew's team ${resolveTeam(c.team, year).label}` : ""}.`),
    ...lm.map((l) => `Le Mans ${l.year} overall winner: ${resolveCar(l.car).label} — ${names(l.drivers)}${l.team ? ` (${resolveTeam(l.team, year).label})` : ""}.`),
    events.length ? `Calendar: ${events.map((e) => `R${e.round} ${e.name} (${fmtDate(e.date)})${e.results[0]?.podium[0] ? ` won by ${crew(e.results[0].podium[0], year)}` : " — result not yet in archive"}`).join("; ")}.` : "Race-by-race results for this season are not yet in the archive.",
    ...s.standings.map((t) => `${className(t.classId)} ${t.kind} standings${t.complete ? "" : " (partial)"}: ${t.rows.map((r) => `${r.pos}. ${r.entrant.map((x) => resolveAny(x, year).label).join("/")}${r.points !== undefined ? ` ${r.points} pts` : ""}`).join(", ")}.`),
    s.story ? `Story of the season: ${stripLinks(s.story)}` : "",
  ];
  return { id: `season:${year}`, kind: "season", title: `${seasonLabel(year)} season`, href: href.season(year), text: lines.filter(Boolean).join("\n") };
}

function eventDoc(id: string): Doc {
  const e = ix().events.get(id)!;
  const lines = [
    `${seasonLabel(e.season)} ${e.name} — round ${e.round}, ${e.circuit}, ${countryName(e.country)}, ${fmtDate(e.date)}. Format: ${e.format}.`,
    e.summary ?? "",
    ...(e.results.length
      ? e.results.map(
          (r) =>
            `${className(r.classId)}: ${r.podium.map((p, i) => `${i + 1}. ${crew(p, e.season)}`).join("; ")}${r.pole ? `. Pole: ${crew(r.pole, e.season)}` : ""}${r.laps ? `. Winner's laps: ${r.laps}` : ""}${r.note ? `. Note: ${r.note}` : ""}.`,
        )
      : ["Results for this race are not yet in the archive."]),
  ];
  return { id: `event:${id}`, kind: "event", title: `${seasonLabel(e.season)} ${e.name}`, href: href.event(id), text: lines.filter(Boolean).join("\n") };
}

function carDoc(id: string): Doc {
  const c = ix().cars.get(id)!;
  const s = carStats(id);
  const lines = [
    `${c.name} — ${resolveManufacturer(c.manufacturerId).label}, ${className(c.classId)}, raced ${c.from}–${c.to ?? "present"}.`,
    `Powertrain: ${c.powertrain}`,
    c.summary,
    `Teams in archive: ${s.teamIds.map((t) => resolveTeam(t).label).join(", ") || "none"}. Drivers: ${s.driverIds.map((d) => resolveDriver(d).label).join(", ") || "none"}.`,
    `Le Mans overall wins: ${s.leMansWins.join(", ") || "none"}.`,
  ];
  return { id: `car:${id}`, kind: "car", title: c.name, href: href.car(id), text: lines.join("\n") };
}

function manufacturerDoc(id: string): Doc {
  const m = ix().manufacturers.get(id)!;
  const s = manufacturerStats(id);
  const lines = [
    `${m.name} — ${countryName(m.country)}. ${m.summary}`,
    `Le Mans overall wins: ${s.leMansWins.join(", ") || "none"}. Manufacturers' world titles in archive: ${years(s.titles)}.`,
    `Cars in archive: ${s.cars.map((c) => `${c.name} (${c.from}–${c.to ?? "present"})`).join(", ") || "none"}.`,
  ];
  return { id: `manufacturer:${id}`, kind: "manufacturer", title: m.name, href: href.manufacturer(id), text: lines.join("\n") };
}

let corpus: Doc[] | null = null;
export function getCorpus(): Doc[] {
  if (corpus) return corpus;
  const a = archive();
  const docs: Doc[] = [
    ...a.teams.map((t) => teamDoc(t.id)),
    ...a.drivers.map((d) => driverDoc(d.id)),
    ...a.seasons.filter((s) => s.status !== "not-held").map((s) => seasonDoc(s.year)),
    ...a.events.map((e) => eventDoc(e.id)),
    ...a.cars.map((c) => carDoc(c.id)),
    ...a.manufacturers.map((m) => manufacturerDoc(m.id)),
    ...a.stories.map((s) => ({ id: `story:${s.slug}`, kind: "story", title: s.title, href: href.story(s.slug), text: `${s.title} — ${s.dek}\n${stripLinks(s.body)}` })),
    ...a.eras.map((e) => ({ id: `era:${e.slug}`, kind: "era", title: `${e.name} (${e.short})`, href: href.era(e.slug), text: `${e.name}, ${e.short}. ${e.summary} Hallmarks: ${e.hallmarks.join("; ")}.` })),
  ];
  // Le Mans honour roll, one passage per decade.
  const decades = new Map<number, string[]>();
  for (const l of a.leMans) {
    const d = Math.floor(l.year / 10) * 10;
    decades.set(d, [...(decades.get(d) ?? []), `${l.year}: ${resolveCar(l.car).label} (${resolveManufacturer(l.manufacturer).label}) — ${names(l.drivers)}${l.team ? `, entered by ${resolveTeam(l.team).label}` : ""}`]);
  }
  for (const [d, rows] of decades)
    docs.push({ id: `lemans:${d}s`, kind: "lemans", title: `Le Mans winners, ${d}s`, href: `/le-mans#d${d}`, text: `24 Hours of Le Mans overall winners in the ${d}s:\n${rows.join("\n")}` });
  corpus = docs;
  return docs;
}

export const docFor = (id: string) => getCorpus().find((d) => d.id === id);
