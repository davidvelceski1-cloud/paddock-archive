import "server-only";
import { COUNTRIES, countryName, demonym } from "@/data/countries";
import type { ClassId, Driver, Team } from "@/data/schema";
import { archive, className, ix, seasonEndYear, teamDisplayName } from "@/lib/archive/data";
import { driverStats, teamClasses, teamStats } from "@/lib/archive/stats";
import { norm } from "./fuzzy";

/**
 * List-view filters. One shape travels three ways: URL params (shareable), structured
 * output from the natural-language parser, and removable chips on the page.
 */
export type Scope = "teams" | "drivers";
export type Filters = {
  q?: string;
  status?: "active" | "defunct" | "retired";
  country?: string;
  class?: ClassId;
  manufacturer?: string;
  decade?: number;
  era?: string;
  leftBefore?: number;
  leftAfter?: number;
  activeIn?: number;
  team?: string;
  champion?: boolean;
  lemans?: boolean;
  sort?: string;
};

const FILTER_KEYS = ["q", "status", "country", "class", "manufacturer", "decade", "era", "leftBefore", "leftAfter", "activeIn", "team", "champion", "lemans", "sort"] as const;
const NUMERIC = new Set(["decade", "leftBefore", "leftAfter", "activeIn"]);
const BOOL = new Set(["champion", "lemans"]);

export function fromParams(sp: Record<string, string | string[] | undefined>): Filters {
  const f: Record<string, unknown> = {};
  for (const k of FILTER_KEYS) {
    const raw = sp[k];
    const v = Array.isArray(raw) ? raw[0] : raw;
    if (!v) continue;
    if (NUMERIC.has(k)) {
      const n = Number(v);
      if (Number.isInteger(n)) f[k] = n;
    } else if (BOOL.has(k)) f[k] = v === "1" || v === "true";
    else f[k] = v;
  }
  return f as Filters;
}

export function toParams(f: Filters) {
  const p = new URLSearchParams();
  for (const k of FILTER_KEYS) {
    const v = f[k];
    if (v === undefined || v === null || v === "" || v === false) continue;
    p.set(k, v === true ? "1" : String(v));
  }
  return p;
}

// ───────────── Applying ─────────────
const lastYear = (t: Team) => (t.lastSeason === null ? 9999 : seasonEndYear(t.lastSeason));

export function applyTeams(f: Filters, teams: Team[] = archive().teams) {
  return teams.filter((t) => {
    const s = teamStats(t.id);
    const nameHay = norm(t.names.map((n) => n.name).join(" "));
    if (f.q && !norm(f.q).split(/\s+/).every((w) => nameHay.includes(w))) return false;
    if (f.status && f.status !== "retired" && t.status !== f.status) return false;
    if (f.country && t.country !== f.country) return false;
    if (f.class && !teamClasses(t.id).includes(f.class)) return false;
    if (f.manufacturer && !t.manufacturerIds.includes(f.manufacturer)) return false;
    if (f.decade !== undefined && !s.seasons.some((y) => y >= f.decade! && y <= f.decade! + 9) && !(t.firstSeason <= f.decade + 9 && lastYear(t) >= f.decade)) return false;
    if (f.era) {
      const e = ix().eras.get(f.era);
      if (e && !s.seasons.some((y) => y >= e.from && y <= (e.to ?? 9999))) return false;
    }
    if (f.leftBefore !== undefined && !(t.status === "defunct" && lastYear(t) < f.leftBefore)) return false;
    if (f.leftAfter !== undefined && !(t.status === "defunct" && lastYear(t) > f.leftAfter)) return false;
    if (f.activeIn !== undefined && !s.seasons.includes(f.activeIn)) return false;
    if (f.champion && !s.titles.length) return false;
    if (f.lemans && !s.leMansWins.length) return false;
    return true;
  });
}

export function applyDrivers(f: Filters, drivers: Driver[] = archive().drivers) {
  return drivers.filter((d) => {
    const s = driverStats(d.id);
    if (f.q && !norm(f.q).split(/\s+/).every((w) => norm(d.name).includes(w))) return false;
    if (f.status === "active" && d.status !== "active") return false;
    if ((f.status === "retired" || f.status === "defunct") && d.status !== "retired") return false;
    if (f.country && d.nationality !== f.country) return false;
    if (f.class && !s.entries.some((e) => e.classId === f.class)) return false;
    if (f.team && !s.teams.includes(f.team)) return false;
    if (f.manufacturer && !s.cars.some((c) => ix().cars.get(c)?.manufacturerId === f.manufacturer) && !archive().leMans.some((l) => l.drivers.includes(d.id) && l.manufacturer === f.manufacturer)) return false;
    const careerYears = [...s.seasons, ...s.leMansWins];
    if (f.era) {
      const e = ix().eras.get(f.era);
      if (e && !careerYears.some((y) => y >= e.from && y <= (e.to ?? 9999))) return false;
    }
    if (f.decade !== undefined && !careerYears.some((y) => y >= f.decade! && y <= f.decade! + 9)) return false;
    if (f.activeIn !== undefined && !careerYears.includes(f.activeIn)) return false;
    if (f.champion && !s.titles.length) return false;
    if (f.lemans && !s.leMansWins.length) return false;
    return true;
  });
}

// ───────────── Chips ─────────────
export function chips(f: Filters, scope: Scope): { key: keyof Filters; label: string }[] {
  const out: { key: keyof Filters; label: string }[] = [];
  if (f.q) out.push({ key: "q", label: `Name: “${f.q}”` });
  if (f.status) out.push({ key: "status", label: f.status === "active" ? "Active" : scope === "teams" ? "Defunct" : "Not racing in WEC" });
  if (f.country) out.push({ key: "country", label: scope === "teams" ? countryName(f.country) : demonym(f.country) });
  if (f.class) out.push({ key: "class", label: className(f.class) });
  if (f.manufacturer) out.push({ key: "manufacturer", label: ix().manufacturers.get(f.manufacturer)?.name ?? f.manufacturer });
  if (f.team) out.push({ key: "team", label: `Drove for ${ix().teams.get(f.team) ? teamDisplayName(ix().teams.get(f.team)!) : f.team}` });
  if (f.decade !== undefined) out.push({ key: "decade", label: `${f.decade}s` });
  if (f.era) out.push({ key: "era", label: ix().eras.get(f.era)?.name ?? f.era });
  if (f.leftBefore !== undefined) out.push({ key: "leftBefore", label: `Left before ${f.leftBefore}` });
  if (f.leftAfter !== undefined) out.push({ key: "leftAfter", label: `Left after ${f.leftAfter}` });
  if (f.activeIn !== undefined) out.push({ key: "activeIn", label: `Raced in ${f.activeIn}` });
  if (f.champion) out.push({ key: "champion", label: "World champions" });
  if (f.lemans) out.push({ key: "lemans", label: "Le Mans winners" });
  return out;
}

// ───────────── Rules parser (offline fallback) ─────────────
const CLASS_WORDS: [RegExp, ClassId][] = [
  [/\bhyper ?cars?\b|\blmh\b|\blmdh\b/, "hypercar"],
  [/\blmp ?1\b/, "lmp1"],
  [/\blmp ?2\b/, "lmp2"],
  [/\bgt ?3\b|\blmgt3\b/, "lmgt3"],
  [/\bgte ?am\b/, "lmgte-am"],
  [/\bgte\b|\bgte ?pro\b|\bgt\b/, "lmgte-pro"],
  [/\bgroup ?c\b/, "group-c"],
];

/** Deterministic parser used when no model is configured (and as a safety net). */
export function parseWithRules(q: string, scope: Scope): Filters {
  const s = ` ${norm(q)} `;
  const f: Filters = {};
  for (const [code, c] of Object.entries(COUNTRIES)) if (s.includes(` ${norm(c.demonym)} `) || s.includes(` ${norm(c.name)} `) || s.includes(` from ${norm(c.name)}`)) f.country = code;
  if (/\b(active|current|still racing|today)\b/.test(s)) f.status = "active";
  if (/\b(defunct|left|gone|former|withdrew|quit|exited|retired|no longer)\b/.test(s)) f.status = scope === "teams" ? "defunct" : "retired";
  const before = s.match(/\b(?:left|quit|exited|withdrew|before)\D{0,12}(\d{4})/);
  if (before && /before|prior/.test(s)) {
    f.leftBefore = Number(before[1]);
    if (scope === "teams") f.status = "defunct";
  }
  const after = s.match(/\bafter\D{0,6}(\d{4})/);
  if (after && scope === "teams" && /left|quit|exit|withdr/.test(s)) f.leftAfter = Number(after[1]);
  const decade = s.match(/\b(19|20)(\d)0s\b/);
  if (decade) f.decade = Number(`${decade[1]}${decade[2]}0`);
  const inYear = s.match(/\bin (\d{4})\b/);
  if (inYear && !f.leftBefore) f.activeIn = Number(inYear[1]);
  for (const [re, c] of CLASS_WORDS)
    if (re.test(s)) {
      f.class = c;
      break;
    }
  for (const m of archive().manufacturers) if (new RegExp(`\\b${norm(m.name).replace(/[^a-z0-9 ]/g, ".")}\\b`).test(s)) f.manufacturer = m.id;
  for (const e of archive().eras) if (s.includes(norm(e.name)) || (e.slug === "hypercar" && /hypercar era/.test(s))) f.era = e.slug;
  if (/\bchampions?\b|\btitle/.test(s)) f.champion = true;
  if (/le mans (winners?|win)|won le mans/.test(s)) f.lemans = true;
  if (scope === "drivers" && f.manufacturer) {
    const team = archive().teams.find((t) => t.manufacturerIds.includes(f.manufacturer!) && /drove for|raced for/.test(s));
    if (team) f.team = team.id;
  }
  if (!Object.keys(f).length && q.trim().split(/\s+/).length <= 3) f.q = q.trim();
  return f;
}

export const VOCAB = () => ({
  countries: Object.entries(COUNTRIES).map(([code, c]) => `${code}=${c.name}/${c.demonym}`).join(", "),
  classes: archive().classes.filter((c) => c.id !== "overall").map((c) => `${c.id}=${c.name}`).join(", "),
  manufacturers: archive().manufacturers.map((m) => `${m.id}=${m.name}`).join(", "),
  teams: archive().teams.map((t) => `${t.id}=${t.names.map((n) => n.name).join("/")}`).join(", "),
  eras: archive().eras.map((e) => `${e.slug}=${e.name} (${e.from}–${e.to ?? "today"})`).join(", "),
});
