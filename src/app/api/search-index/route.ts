import { countryName } from "@/data/countries";
import { archive, href, ix, resolveTeam, seasonLabel, teamDisplayName } from "@/lib/archive/data";

export const dynamic = "force-static";

export type SearchItem = { t: "season" | "team" | "driver" | "car" | "manufacturer" | "race" | "story"; l: string; s?: string; h: string; w: number; k?: string };

/** Compact index for the ⌘K command palette. */
export async function GET() {
  const a = archive();
  const items: SearchItem[] = [];
  for (const t of a.teams)
    items.push({ t: "team", l: teamDisplayName(t), s: `${countryName(t.country)} · ${t.status === "active" ? "Active" : "Defunct"}`, h: href.team(t.id), w: 6, k: t.names.map((n) => n.name).join(" ") });
  for (const d of a.drivers) items.push({ t: "driver", l: d.name, s: countryName(d.nationality), h: href.driver(d.id), w: 5 });
  for (const s of [...a.seasons].reverse())
    if (s.status !== "not-held")
      items.push({ t: "season", l: `${seasonLabel(s.year)} season`, s: s.championshipId ? ix().championships.get(s.championshipId)?.short : "Le Mans", h: href.season(s.year), w: s.year >= 2010 ? 4 : 2 });
  for (const c of a.cars) items.push({ t: "car", l: c.name, s: `${c.from}${c.to !== c.from ? `–${c.to ?? ""}` : ""}`, h: href.car(c.id), w: 4 });
  for (const m of a.manufacturers) items.push({ t: "manufacturer", l: m.name, s: countryName(m.country), h: href.manufacturer(m.id), w: 3 });
  for (const e of a.events) items.push({ t: "race", l: `${seasonLabel(e.season)} ${e.name}`, s: e.results[0]?.podium[0] ? resolveTeam(e.results[0].podium[0].team, e.season).label : undefined, h: href.event(e.id), w: 1, k: e.circuit });
  for (const s of a.stories) items.push({ t: "story", l: s.title, s: "Story", h: href.story(s.slug), w: 3 });
  return Response.json(items);
}
