import "server-only";
import { archive, href, ix, seasonLabel, teamDisplayName } from "./data";
import { driverStats, teamStats, teammates } from "./stats";

export type RelatedKind = "team" | "driver" | "season" | "car" | "story" | "manufacturer";
export type RelatedItem = { key: string; kind: RelatedKind; label: string; href: string; reason: string; score: number };

/** Teams that raced the same class in the same seasons. */
function rivalTeams(teamId: string) {
  const a = archive();
  const mine = a.teamEntries.filter((e) => e.teamId === teamId);
  const scores = new Map<string, number[]>();
  for (const e of a.teamEntries) {
    if (e.teamId === teamId) continue;
    if (mine.some((m) => m.season === e.season && m.classId === e.classId)) scores.set(e.teamId, [...new Set([...(scores.get(e.teamId) ?? []), e.season])]);
  }
  return [...scores.entries()].map(([id, seasons]) => ({ id, seasons }));
}

function storyLinks(key: string): RelatedItem[] {
  return archive()
    .stories.filter((s) => s.related.includes(key))
    .map((s) => ({ key: `story:${s.slug}`, kind: "story", label: s.title, href: href.story(s.slug), reason: "Featured story", score: 9 }));
}

export function related(key: string, limit = 8): RelatedItem[] {
  const [kind, id] = [key.slice(0, key.indexOf(":")), key.slice(key.indexOf(":") + 1)];
  const a = archive();
  const out: RelatedItem[] = [];
  const team = (tid: string, reason: string, score: number) => {
    const t = ix().teams.get(tid);
    if (t) out.push({ key: `team:${tid}`, kind: "team", label: teamDisplayName(t), href: href.team(tid), reason, score });
  };
  const driver = (did: string, reason: string, score: number) => {
    const d = ix().drivers.get(did);
    if (d) out.push({ key: `driver:${did}`, kind: "driver", label: d.name, href: href.driver(did), reason, score });
  };
  const season = (y: number, reason: string, score: number) => {
    if (ix().seasons.has(y)) out.push({ key: `season:${y}`, kind: "season", label: `${seasonLabel(y)} season`, href: href.season(y), reason, score });
  };
  const car = (cid: string, reason: string, score: number) => {
    const c = ix().cars.get(cid);
    if (c) out.push({ key: `car:${cid}`, kind: "car", label: c.name, href: href.car(cid), reason, score });
  };

  if (kind === "team") {
    const s = teamStats(id);
    for (const r of rivalTeams(id)) team(r.id, `Rival · ${r.seasons.length} shared season${r.seasons.length > 1 ? "s" : ""}`, 4 + r.seasons.length);
    const driverSeasons = new Map<string, number>();
    for (const e of a.driverEntries.filter((e) => e.team === id)) driverSeasons.set(e.driverId, (driverSeasons.get(e.driverId) ?? 0) + 1);
    for (const [did, n] of driverSeasons) driver(did, `Drove for them · ${n} season${n > 1 ? "s" : ""}`, 3 + n);
    for (const y of s.titles) season(y, "Title season", 6);
    for (const y of s.leMansWins) if (!s.titles.includes(y)) season(y, "Le Mans win", 5);
  } else if (kind === "driver") {
    const s = driverStats(id);
    for (const t of teammates(id)) driver(t.driver, `Teammate · ${t.years.length} season${t.years.length > 1 ? "s" : ""}`, 5 + t.years.length * 1.5);
    for (const tid of s.teams) team(tid, `Drove for · ${s.entries.filter((e) => e.team === tid).length} season(s)`, 6);
    for (const y of s.titles) season(y, "Title season", 7);
    // Rivals: drivers champion-crewed against in the same season and class.
    for (const e of s.entries)
      for (const o of a.driverEntries)
        if (o.season === e.season && o.classId === e.classId && o.team !== e.team && a.seasons.find((x) => x.year === e.season)?.champions.some((c) => c.drivers?.includes(o.driverId)))
          driver(o.driverId, `Title rival · ${seasonLabel(e.season)}`, 3);
  } else if (kind === "season") {
    const y = Number(id);
    const s = ix().seasons.get(y);
    const years = a.seasons.filter((x) => x.status !== "not-held").map((x) => x.year);
    const i = years.indexOf(y);
    if (i > 0) season(years[i - 1], "Previous season", 6);
    if (i >= 0 && i < years.length - 1) season(years[i + 1], "Next season", 6);
    for (const c of s?.champions ?? []) {
      if (c.team) team(c.team, "Champion team", 8);
      c.drivers?.forEach((d) => driver(d, "Champion", 7));
      if (c.car) car(c.car, "Champion car", 5);
    }
    for (const e of a.teamEntries.filter((e) => e.season === y)) team(e.teamId, "Competed this season", 3);
    const era = s && ix().eras.get(s.eraSlug);
    if (era) for (const st of a.stories.filter((st) => st.eraSlug === era.slug)) out.push({ key: `story:${st.slug}`, kind: "story", label: st.title, href: href.story(st.slug), reason: `${era.name} story`, score: 4 });
  } else if (kind === "car") {
    const c = ix().cars.get(id);
    if (c) {
      for (const o of a.cars)
        if (o.id !== id && o.classId === c.classId && o.from <= (c.to ?? 9999) && (o.to ?? 9999) >= c.from)
          car(o.id, `Contemporary rival · ${c.classId === "overall" ? "" : ix().classes.get(c.classId)?.short}`.replace(/ · $/, ""), 5);
      for (const e of a.teamEntries.filter((e) => e.car === id)) team(e.teamId, "Raced it", 6);
      const m = ix().manufacturers.get(c.manufacturerId);
      if (m) out.push({ key: `manufacturer:${m.id}`, kind: "manufacturer", label: m.name, href: href.manufacturer(m.id), reason: "Manufacturer", score: 7 });
    }
  } else if (kind === "story") {
    for (const k of ix().stories.get(id)?.related ?? []) {
      const [rk, rid] = [k.slice(0, k.indexOf(":")), k.slice(k.indexOf(":") + 1)];
      if (rk === "team") team(rid, "In this story", 6);
      else if (rk === "driver") driver(rid, "In this story", 6);
      else if (rk === "car") car(rid, "In this story", 5);
    }
    for (const s of a.stories) if (s.slug !== id) out.push({ key: `story:${s.slug}`, kind: "story", label: s.title, href: href.story(s.slug), reason: "More stories", score: 3 });
  }
  out.push(...storyLinks(key));

  // Keep the best-scoring reason per entity; rank; never include the page itself.
  const best = new Map<string, RelatedItem>();
  for (const r of out) if (r.key !== key && (!best.has(r.key) || best.get(r.key)!.score < r.score)) best.set(r.key, r);
  return [...best.values()].sort((x, y) => y.score - x.score || x.label.localeCompare(y.label)).slice(0, limit);
}
