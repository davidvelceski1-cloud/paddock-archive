/**
 * Find freely licensed photos on Wikimedia Commons and store them in data/photos.json.
 *
 *   npm run photos:fetch                    # fill in anything missing
 *   npm run photos:fetch -- --only entries  # drivers | teams | cars | entries
 *   npm run photos:fetch -- --refresh       # re-pick every photo still marked "auto": true
 *   npm run photos:fetch -- --out other.json  # write somewhere other than data/photos.json
 *
 * - Drivers, teams and cars use the free lead image of their Wikipedia article.
 * - Each team-season entry gets a Commons photo of that chassis from that season. A photo
 *   only counts if its file name or capture date shows the season's year and it mentions the
 *   model (e.g. "919"). Otherwise the entry is left without a photo rather than mislabelled,
 *   and the page shows the car's general photo marked "not from this season".
 * - Only free licences (CC, public domain, GFDL) are accepted, and logos are skipped.
 *
 * Photos you set or check by hand: edit data/photos.json and set "auto": false.
 * The script never overwrites those.
 */
import fs from "node:fs";
import path from "node:path";
import { Archive, ArchivePatch, mergeArchive, Photos, type Photo } from "../src/data/schema.ts";
import { seed } from "../src/data/seed/index.ts";

const args = process.argv.slice(2);
const OUT = args.includes("--out") ? path.resolve(args[args.indexOf("--out") + 1]) : path.join(process.cwd(), "data", "photos.json");
const refresh = args.includes("--refresh");
const only = args.includes("--only") ? args[args.indexOf("--only") + 1] : undefined;
/** --season 2026: limit the season-entry pass to one season (so hand-removed picks elsewhere stay removed). */
const onlySeason = args.includes("--season") ? Number(args[args.indexOf("--season") + 1]) : undefined;
const UA = "PaddockArchive/0.1 (local photo fetch script)";
const WIDTH = 1280;

// ───────────── Archive ─────────────
let a = Archive.parse(seed);
const importFile = path.join(process.cwd(), "data", "archive.json");
if (fs.existsSync(importFile)) a = mergeArchive(a, ArchivePatch.parse(JSON.parse(fs.readFileSync(importFile, "utf8"))));
const carName = (ref: string) => a.cars.find((c) => c.id === ref)?.name ?? ref;
const teamName = (id: string, season?: number) => {
  const t = a.teams.find((x) => x.id === id);
  if (!t) return id;
  const hit = season === undefined ? undefined : t.names.find((n) => season >= n.from && (n.to === null || season <= n.to));
  return (hit ?? t.names[t.names.length - 1]).name;
};
/** Calendar years a season key covers: 2018 → [2018, 2019] for "2018–19". */
const seasonYears = (season: number) => {
  const label = a.seasons.find((s) => s.year === season)?.label;
  return label ? [season, season + 1] : [season];
};

// ───────────── Wikimedia API ─────────────
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
async function api(host: string, params: Record<string, string>): Promise<any> {
  const url = `https://${host}/w/api.php?` + new URLSearchParams({ format: "json", formatversion: "2", origin: "*", ...params });
  for (let attempt = 0; attempt < 6; attempt++) {
    const res = await fetch(url, { headers: { "User-Agent": UA } });
    if (res.status === 429 || res.status >= 500) {
      // Wikimedia rate-limits anonymous clients: honour Retry-After, else back off exponentially.
      const wait = Number(res.headers.get("retry-after")) * 1000 || 3000 * 2 ** attempt;
      await sleep(Math.min(wait, 60_000));
      continue;
    }
    if (!res.ok) throw new Error(`${res.status} ${url}`);
    await sleep(400); // stay polite
    return res.json();
  }
  throw new Error(`Gave up on ${url}`);
}

const FREE = /\b(cc|cc0|public domain|pd|gfdl|attribution|free art)\b/i;
const strip = (html = "") => html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
const fold = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

type FileInfo = { title: string; photo: Omit<Photo, "alt">; text: string; date: string; w: number; h: number };

/** Files rejected by hand for the key currently being filled (from data/photos-skip.json). */
let rejectedNow = new Set<string>();

/** `allowSvg`: accept SVG files (Commons serves a PNG rendering as the thumbnail), used for track maps. */
function toFileInfo(page: any, allowSvg = false): FileInfo | null {
  const ii = page?.imageinfo?.[0];
  if (!ii || !(allowSvg ? /image\/(jpeg|png|webp|svg\+xml)/ : /image\/(jpeg|png|webp)/).test(ii.mime ?? "")) return null;
  if (rejectedNow.has(page.title)) return null;
  const m = ii.extmetadata ?? {};
  const license = strip(m.LicenseShortName?.value) || "";
  if (!FREE.test(license)) return null;
  if (/logo|emblem|badge|icon/i.test(page.title)) return null;
  return {
    w: Number(ii.width) || 0,
    h: Number(ii.height) || 0,
    title: page.title,
    photo: {
      src: ii.thumburl ?? ii.url,
      credit: (strip(m.Artist?.value) || strip(m.Credit?.value) || "Unknown author").slice(0, 140),
      license,
      licenseUrl: m.LicenseUrl?.value || undefined,
      page: ii.descriptionurl,
      auto: true,
    },
    text: fold(`${page.title} ${strip(m.ImageDescription?.value)} ${m.Categories?.value ?? ""}`),
    date: String(strip(m.DateTimeOriginal?.value) || ""),
  };
}

const IIPROP = { prop: "imageinfo", iiprop: "url|mime|size|extmetadata", iiurlwidth: String(WIDTH), iiextmetadatafilter: "Artist|Credit|LicenseShortName|LicenseUrl|ImageDescription|DateTimeOriginal|Categories" };

async function commonsFile(fileTitle: string, allowSvg = false): Promise<FileInfo | null> {
  const r = await api("commons.wikimedia.org", { action: "query", titles: fileTitle, ...IIPROP });
  return toFileInfo(r.query?.pages?.[0], allowSvg);
}

async function commonsSearch(q: string, limit = 20): Promise<FileInfo[]> {
  const r = await api("commons.wikimedia.org", { action: "query", generator: "search", gsrsearch: `${q} filetype:bitmap`, gsrnamespace: "6", gsrlimit: String(limit), ...IIPROP });
  const pages: any[] = (r.query?.pages ?? []).sort((x: any, y: any) => x.index - y.index);
  return pages.map((p) => toFileInfo(p)).filter((x): x is FileInfo => !!x);
}

/** Free lead image of the best-matching English Wikipedia article. */
async function articlePhoto(query: string, accept: (title: string) => boolean, allowSvg = false): Promise<FileInfo | null> {
  const s = await api("en.wikipedia.org", { action: "query", list: "search", srsearch: query, srlimit: "5" });
  const hit = (s.query?.search ?? []).find((h: any) => accept(h.title));
  if (!hit) return null;
  const p = await api("en.wikipedia.org", { action: "query", titles: hit.title, redirects: "1", prop: "pageimages", piprop: "name", pilicense: "free" });
  const file = p.query?.pages?.[0]?.pageimage;
  if (!file || (!allowSvg && /\.svg$/i.test(file))) return null;
  return commonsFile(`File:${file}`, allowSvg);
}

/**
 * Words a photo must mention to count as this model: every word with a digit ("919", "r18",
 * "gr010"), or, when the name has none, every word after the make ("vantage" + "amr").
 */
function modelWords(chassis: string) {
  const words = fold(chassis.replace(/\(.*?\)/g, "")).split(/[\s/]+/).filter(Boolean);
  const digits = words.filter((w) => /\d/.test(w) && w.length > 1);
  return digits.length ? digits : words.slice(1);
}
/** Short tokens ("iv", "gt", "81") must match as whole words, so "gt" does not match "gte". */
const has = (text: string, w: string) =>
  w.length <= 3 ? new RegExp(`(^|[^a-z0-9])${w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}([^a-z0-9]|$)`).test(text) : text.includes(w);
const mentions = (text: string, words: string[]) => words.every((w) => has(text, w));
/**
 * Stricter words for a car model: every word after the make except generic ones, so
 * "Audi R18 ultra" needs "r18" and "ultra" and "Ford GT40 Mk IV" needs "gt40", "mk" and "iv".
 */
const MODEL_GENERIC = new Set(["hybrid", "racing", "team", "lm", "the"]);
function carModelWords(name: string) {
  const words = fold(name.replace(/\(.*?\)/g, "")).split(/[\s/]+/).filter(Boolean).slice(1);
  const strict = words.filter((w) => !MODEL_GENERIC.has(w));
  return strict.length ? strict : modelWords(name);
}
/** Other categories whose cars share model names (a Vantage GT3 is not a Vantage GTE). */
const OTHER_CLASSES = ["gt3", "gt4", "lmp3", "super gt", "supercup", "road car", "dtm"];
const wrongClass = (text: string, chassis: string) => OTHER_CLASSES.some((c) => text.includes(c) && !fold(chassis).includes(c));
const GENERIC = new Set(["racing", "team", "sport", "sports", "motorsport", "motorsports", "works", "total"]);

// ───────────── Run ─────────────
const existing: Record<string, Photo> = fs.existsSync(OUT) ? Photos.parse(JSON.parse(fs.readFileSync(OUT, "utf8"))) : {};
const out: Record<string, Photo> = { ...existing };
// data/photos-skip.json: automatic picks that were wrong and removed by hand.
//   { "<key>": true }            never fill this key automatically
//   { "<key>": ["File:…", …] }   never use these files for it, but keep looking for another
// (A plain array of keys is read as all `true`.)
const SKIP_FILE = path.join(path.dirname(OUT), "photos-skip.json");
const skipRaw: unknown = fs.existsSync(SKIP_FILE) ? JSON.parse(fs.readFileSync(SKIP_FILE, "utf8")) : {};
const skip: Record<string, true | string[]> = Array.isArray(skipRaw) ? Object.fromEntries(skipRaw.map((k: string) => [k, true])) : (skipRaw as Record<string, true | string[]>);
for (const [k, v] of Object.entries(skip)) if (v === true) delete out[k];
const want = (key: string) => skip[key] !== true && (!out[key] || (refresh && !!existing[key]?.auto));
const stats = { found: 0, missing: [] as string[] };
const save = () => fs.writeFileSync(OUT, JSON.stringify(Object.fromEntries(Object.entries(out).sort(([x], [y]) => x.localeCompare(y))), null, 2) + "\n");

async function put(key: string, alt: string, find: () => Promise<FileInfo | null>) {
  if (!want(key)) return;
  const s = skip[key];
  rejectedNow = new Set(Array.isArray(s) ? s : []);
  try {
    const f = await find();
    if (f) {
      out[key] = { ...f.photo, alt };
      stats.found++;
      console.log(`  ✓ ${key}  ←  ${f.title}`);
    } else {
      // On --refresh, an automatic pick that no longer passes the checks is dropped, not kept.
      if (out[key]?.auto) delete out[key];
      stats.missing.push(key);
      console.log(`  · ${key}  (no free photo found)`);
    }
  } catch (e) {
    stats.missing.push(key);
    console.log(`  ✗ ${key}  ${(e as Error).message}`);
  }
}

if (!only || only === "drivers") {
  console.log("Drivers");
  for (const d of a.drivers) {
    const name = fold(d.name);
    const last = name.split(" ").pop()!;
    await put(`driver:${d.id}`, `Portrait of ${d.name}`, () =>
      articlePhoto(`${d.name} racing driver`, (t) => fold(t.replace(/\s*\(.*\)$/, "")) === name || fold(t).includes(last)),
    );
  }
  save();
}

if (!only || only === "tracks") {
  console.log("Tracks (layout map + photo)");
  for (const t of a.tracks) {
    const words = fold(t.name.replace(/\(.*?\)/g, ""))
      .split(/[\s-]+/)
      .filter((w) => w.length > 3 && !["circuit", "international", "autodromo", "autódromo", "raceway", "speedway", "nazionale"].includes(w));
    // The circuit's Wikipedia infobox image is usually its layout map (often an SVG).
    await put(`trackmap:${t.id}`, `Layout map of ${t.name}`, () => articlePhoto(`${t.name} circuit`, (title) => words.some((w) => fold(title).includes(w)), true));
    // A real photo: Commons search, which must mention the circuit and not be a map.
    await put(`track:${t.id}`, `${t.name}`, async () => {
      for (const q of [`"${t.name.replace(/\s*\(.*?\)/g, "")}"`, `${t.location.split(",")[0]} circuit ${words[0] ?? ""}`]) {
        const hit = (await commonsSearch(q)).find((f) => words.some((w) => f.text.includes(w)) && !/map|layout|plan|track ?map|\.svg/i.test(f.title));
        if (hit) return hit;
      }
      return null;
    });
  }
  save();
}

if (!only || only === "cars") {
  console.log("Cars");
  // Profiled cars, cars raced by team entries, and every Le Mans winner (for the season hover cards).
  const refs = new Set([...a.cars.map((c) => c.id), ...a.teamEntries.map((e) => e.car), ...a.leMans.map((l) => l.car)]);
  for (const ref of refs) {
    const name = carName(ref);
    const words = carModelWords(name);
    const ok = (f: FileInfo | null) => (f && mentions(f.text, words) && !wrongClass(f.text, name) ? f : null);
    await put(`car:${ref}`, name, async () => ok(await articlePhoto(name, (t) => mentions(fold(t), words))) ?? (await commonsSearch(`"${name}"`)).find((f) => ok(f)) ?? null);
  }
  save();
}

if (!only || only === "entries") {
  console.log("Season entries (car photos by year)");
  const usedByTeam = new Map<string, Set<string>>();
  const seen = new Set<string>();
  for (const e of [...a.teamEntries].filter((x) => onlySeason === undefined || x.season === onlySeason).sort((x, y) => x.teamId.localeCompare(y.teamId) || x.season - y.season)) {
    const key = `entry:${e.teamId}|${e.season}|${e.car}`;
    if (seen.has(key)) continue;
    seen.add(key);
    const chassis = e.chassis ?? carName(e.car);
    const base = chassis.replace(/\(.*?\)/g, "").trim();
    const words = modelWords(chassis);
    const years = seasonYears(e.season);
    const team = e.nameUsed ?? teamName(e.teamId, e.season);
    // Words that point at this team rather than the make: "joest", "rebellion", "penske", "corse"…
    const chassisWords = new Set(fold(chassis).split(/\s+/));
    const teamWords = [...new Set([team, ...a.teams.filter((t) => t.id === e.teamId).flatMap((t) => t.names.map((n) => n.name))].flatMap((n) => fold(n).split(/\s+/)))].filter(
      (w) => w.length > 3 && !GENERIC.has(w) && !chassisWords.has(w),
    );
    const used = usedByTeam.get(e.teamId) ?? new Set<string>();
    usedByTeam.set(e.teamId, used);
    await put(key, `${chassis}, ${team}, ${years.join("–")} season`, async () => {
      let best = null as { f: FileInfo; score: number } | null;
      for (const y of years) {
        for (const q of [`${base} ${y}`, `${base} ${y} Le Mans`]) {
          for (const f of await commonsSearch(q)) {
            if (used.has(f.title) || !mentions(f.text, words) || wrongClass(f.text, chassis)) continue;
            const inTitle = years.some((yy) => fold(f.title).includes(String(yy)));
            const dated = years.some((yy) => f.date.startsWith(String(yy)));
            if (!inTitle && !dated) continue; // no evidence it's from this season
            const byTeam = teamWords.some((w) => f.text.includes(w));
            const byNumber = e.numbers.some((n) => new RegExp(`(#|-|no\\.? ?|n° ?)${n}\\b`).test(fold(f.title)));
            if (!byTeam && !byNumber) continue; // could be another entrant's car
            const score = (inTitle ? 2 : 0) + (dated ? 2 : 0) + (byTeam ? 1 : 0) + (byNumber ? 1 : 0);
            if (!best || score > best.score) best = { f, score };
          }
          if (best && best.score >= 5) break;
        }
      }
      if (best) used.add(best.f.title);
      return best?.f ?? null;
    });
  }
  save();
}

// Extra background photos: wide, landscape race shots from each Le Mans of the WEC era.
if (only === "wallpapers") {
  console.log("Wallpapers (wide Le Mans race photos)");
  const usedSrc = new Set(Object.values(out).map((p) => p.src));
  const PER_YEAR = 2;
  for (let year = 2012; year <= 2026; year++) {
    for (let n = 1; n <= PER_YEAR; n++) {
      await put(`wallpaper:le-mans-${year}-${n}`, `24 Hours of Le Mans ${year}`, async () => {
        for (const q of [`"${year} 24 Hours of Le Mans"`, `Le Mans ${year} 24 Heures`]) {
          const hit = (await commonsSearch(q, 40)).find(
            (f) =>
              !usedSrc.has(f.photo.src) &&
              f.w >= 1600 &&
              f.w / Math.max(1, f.h) >= 1.35 && // landscape, wallpaper-shaped
              has(fold(f.title), String(year)) &&
              f.text.includes("le mans") &&
              !/podium|portrait|pit ?walk|autograph|parade|poster|ticket|crowd|grandstand|press/i.test(f.title),
          );
          if (hit) {
            usedSrc.add(hit.photo.src);
            return hit;
          }
        }
        return null;
      });
    }
  }
  save();
}

// Teams come last: the best team photo is usually its most recent season car, in its own livery.
if (!only || only === "teams") {
  console.log("Teams");
  for (const t of a.teams) {
    const name = t.names[t.names.length - 1].name;
    const latest = a.teamEntries
      .filter((e) => e.teamId === t.id)
      .sort((x, y) => y.season - x.season)
      .map((e) => out[`entry:${e.teamId}|${e.season}|${e.car}`] ?? out[`car:${e.car}`])
      .find(Boolean);
    const key = `team:${t.id}`;
    if (!want(key)) continue;
    if (latest) {
      out[key] = { ...latest, alt: `${name} car on track` };
      stats.found++;
      console.log(`  ✓ ${key}  ←  latest season photo`);
      continue;
    }
    const words = fold(name).split(/\s+/).filter((w) => w.length > 3 && !GENERIC.has(w));
    await put(key, `${name} car on track`, async () => {
      const f = await articlePhoto(`${name} endurance racing`, (title) => words.some((w) => fold(title).includes(w)));
      return f && words.every((w) => f.text.includes(w)) && !wrongClass(f.text, "") ? f : null;
    });
  }
  save();
}

save();
console.log(`\nDone: ${stats.found} photos added, ${stats.missing.length} without a free photo. Written to ${path.relative(process.cwd(), OUT)}.`);
if (stats.missing.length) console.log("Add these by hand if you have a licensed photo:\n  " + stats.missing.join("\n  "));
