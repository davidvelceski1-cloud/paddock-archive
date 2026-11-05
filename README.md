# Paddock Archive

An AI-assisted encyclopedia of world-championship endurance racing: every 24 Hours of Le Mans since 1923, the World Sportscar Championship, the Intercontinental Le Mans Cup and the FIA World Endurance Championship through the Hypercar era.

Browse by **season**, **team**, **driver** and **car / manufacturer**, compare any two or three side by side, jump anywhere with **⌘K / Ctrl+K**, and ask questions in plain language. Every answer is grounded in the archive's own records and cites the pages it used.

> **Data status: placeholder.** All records ship as seed data written from general motorsport knowledge and flagged "pending verification" on every page. Load verified data through the import path below before relying on any of it. See [Data status](#data-status).

## Quick start

```bash
npm install
npm run dev            # http://localhost:3000
```

Optional, in `.env.local` (see `.env.example`):

| Variable | Purpose |
|---|---|
| `ANTHROPIC_API_KEY` | Enables written AI answers, 30-second summaries and AI filter parsing. Without it, every AI feature runs in a deterministic **offline mode** that is still grounded and cited. |
| `DATABASE_URL` | PostgreSQL (with pgvector) for `db:push` / `db:seed`. Not needed to run the site. |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL for Open Graph images and the sitemap. |

| Script | What it does |
|---|---|
| `npm run build` / `start` | Production build (≈270 statically generated pages) and server |
| `npm run typecheck` | TypeScript check |
| `npm run data:validate` | Validate the seed + any imported data, including cross-references |
| `npm run data:import -- <files>` | Import JSON/CSV into `data/archive.json` |
| `npm run db:push` / `db:seed` | Create the Postgres schema and load the archive into it |

Requires Node 22.18+ (scripts run TypeScript directly).

## What's in the app

- **Home** — hero with the universal search/AI bar, "On this day" (or the next anniversary), era timeline, featured stories, quick stats.
- **Seasons** — every year since 1923, filterable by era and championship. Season pages: championship and regulations, classes, race calendar with winners/class winners/pole/laps (sortable), standings, champions, Le Mans winner, story of the season, regulation changes, prev/next.
- **Races** — per-class results, pole, notes; breadcrumbs like *Seasons › 2016 › 24 Hours of Le Mans*.
- **Teams** — facets (status, class, country, manufacturer, decade), sorting, natural-language filters as removable chips, pagination. Team pages: name history, status, career timeline, key stats, cars, drivers, history, "Why they left", notable moments.
- **Drivers** — name search, facets, A–Z, NL filters. Driver pages: career timeline (WEC entries plus historic Le Mans wins), stats, Le Mans results, teammates, teams and cars.
- **Cars & manufacturers** — car pages (powertrain, results, teams, drivers) and manufacturer participation across eras.
- **Compare** — 2–3 drivers, teams or seasons: aligned stat table plus grouped bar chart. The state lives in the URL.
- **Le Mans winners** — the full honour roll by decade.
- **Ask the Archive** — slide-over panel (header button, floating button, ⌘K, hero bar, suggested-prompt pills) and a full page at `/ask`.
- **Sources & corrections** — every page lists its sources and links to `/corrections`, which records submissions in `data/corrections.jsonl`.

Every filter, compare state and page is a shareable URL. Pages ship per-page metadata, Open Graph images (teams, drivers, seasons), JSON-LD, a sitemap and robots.txt.

## Data model

Defined once with zod in [`src/data/schema.ts`](src/data/schema.ts) and mirrored in [`prisma/schema.prisma`](prisma/schema.prisma):

`Source`, `RaceClass`, `Championship`, `Era`, `Manufacturer`, `Car`, `Team` (with **name history**), `Driver`, `TeamSeasonEntry` (team ↔ season: class, car, car numbers, name used), `DriverSeasonEntry` (driver ↔ team ↔ season), `Season` (champions, standings, regulations), `RaceEvent` → `ClassResult` (podium, pole, fastest lap, laps), `LeMansWinner`, `Story`.

- Reference fields hold either the **id** of a profiled record (`audi-sport-team-joest`) or a **display name** for an entity without a page (`"Ford Chip Ganassi Racing"`). Ids are kebab-case, so the two never collide, and the validator checks every id resolves.
- Every factual record carries `sources: string[]`, and the page shows them.
- Season keys are the first calendar year; `2018` is the 2018–19 and `2019` the 2019–20 "super season" (`label` holds the display form).
- Dates are ISO; `YYYY-MM` marks a date whose day hasn't been verified.
- Stats are **computed from records, never stored as totals**. Race-level numbers (wins, podiums, poles) only count races whose results are loaded, and the pages say so.

The app reads `src/data/seed/*` validated through the schema, overlaid with `data/archive.json` (records with the same key replace seed records). Postgres is optional; the same data loads into it with `npm run db:seed`.

## Importing the full archive

```bash
npm run data:import -- data/import/2016.json          # any subset of collections
npm run data:import -- results.csv --type results     # positions into existing events
npm run data:import -- drivers.csv --type drivers
npm run data:validate                                  # check without writing
```

- **JSON** files can hold any subset of the collections in the schema, e.g. `{ "teams": [...], "events": [...] }`.
- **CSV** works for flat collections: `drivers`, `driverEntries`, `teamEntries`, `leMans`, `sources`, and `results`. Headers are field names; list fields use `|` (for example `drivers: tom-kristensen|allan-mcnish`).
- `results` CSV columns: `eventId,classId,pos,team,car,number,drivers,laps,pole`. Rows replace that event's results. See [`data/import/example-results.csv`](data/import/example-results.csv).
- Imports accumulate in `data/archive.json`. Every run re-validates the whole archive and refuses to write if any reference is broken.
- To mark a record as checked, import it with `"verified": true`.

## How the AI grounding works

All three AI features use the same corpus: [`src/lib/ai/documents.ts`](src/lib/ai/documents.ts) writes one plain-text passage per archive page (team, driver, season, race, car, manufacturer, story, era, plus the Le Mans roll by decade) from the same records the page renders.

1. **Retrieval** — BM25 over that corpus, in process ([`retrieval.ts`](src/lib/ai/retrieval.ts)). The page being viewed is always included as a passage, and follow-up questions also use the previous question.
2. **Ask the Archive** (`POST /api/ask`) streams NDJSON: first the numbered sources, then Claude's answer (`claude-opus-5-5`, low effort, prompt-cached system prompt). The system prompt allows only facts from the passages, requires a `[n]` citation on every factual sentence, and requires the answer to say plainly when the archive lacks something. The UI turns `[n]` into links and shows source chips for what was cited.
3. **30-second summaries** (`POST /api/summary`) work the same way, from the page's passage plus a few related ones.
4. **Natural-language filters** (`POST /api/nl-filter`): Claude only maps the sentence onto a fixed filter schema (structured JSON output) and the archive applies the filters. Values outside the known vocabulary are dropped, so the model can't introduce a filter the data can't satisfy. A rules parser handles the offline case.
5. **Safety and failure modes**: server-side refusal fallback is enabled (`fallbacks: "default"`). Without credentials, or on an auth error, the routes answer from the best-matching passage lines, still cited. Rate limits and API errors show a friendly message.

**Upgrading to vector search:** `prisma/schema.prisma` includes `ArchiveChunk` with a `vector(1024)` column. Write the passages from `getCorpus()` into it, embed them with your embedding provider, and replace `retrieve()` with a pgvector similarity query (or a hybrid with BM25). The prompts and citation format stay the same.

## Design system

Tokens live in [`src/app/globals.css`](src/app/globals.css): off-white `#FAFAFB` background, `#ECECF1` borders, ink `#0F1222` / `#5B6075`, an indigo → violet → coral accent gradient used sparingly, muted pastel class colours (Hypercar red, LMP1 blue, LMP2 teal, GT amber, historic grey) for badges and timeline bars, 12px cards and 999px pills, layered soft shadows, and a full dark theme on `#0B0D17`.

- **Fonts:** Geist with tabular numerals for every stat and table.
- **Icons:** Lucide at a 1.5px stroke.
- **Motion:** 150–250ms ease-out using CSS and Framer Motion (`motion`), disabled under `prefers-reduced-motion`.
- **Muted text:** `#9AA0B4` is reserved for decoration because it fails WCAG AA for text; small text uses a darkened `--muted-strong`.
- **Chart colours:** checked with a colour-blindness palette validator for both themes.
- **Core components:** `components/ui/primitives.tsx` (badges, stat tiles, breadcrumbs, empty states), `DataTable` (sticky header, sortable, pinned first column), `CareerTimeline` (horizontal with tooltips on desktop, vertical on mobile), `RelatedRail`, `SourcesSection`, the ⌘K palette and the Ask panel.

## Data status

Everything in `src/data/seed` is placeholder data and needs checking against the official FIA WEC classifications, the Al Kamel timing archive and the ACO's Le Mans archive (listed as sources in the app). Specifically:

- **Featured seasons with race-by-race events:** 2012, 2016, 2023 and 2025. Results we weren't confident about are left empty and show as "not yet in the archive": 2023 Monza, Fuji and Bahrain; 2025 Imola, Spa, São Paulo, COTA, Fuji and Bahrain. Several 2023/2025 dates are month-only.
- **Most podiums hold only the winner.** Points are not loaded for any standings table.
- **Champions** for every WEC season (2012–2025) and the **Le Mans honour roll** (1923–2025) are complete in shape but still unverified.
- **Claims to verify first:**
  - Porsche Penske Motorsport ending its WEC factory entry after 2025.
  - Aston Martin's works GTE Pro exit after 2019–20.
  - The 2012 Bahrain and Shanghai winners.
  - The 2016 Mexico and COTA winners.
  - The 2023 Le Mans third place.
  - Driver `status` values.
  - The crew lists for Toyota's 2012 wins.
- **No world championship rounds before 2010** are loaded, only Le Mans.
- **No images are included.** Use only licensed images or placeholders, and no FIA/WEC/ACO or manufacturer logos.

## Project layout

```
src/data/            schema.ts (zod model), countries.ts, seed/ (placeholder records)
src/lib/archive/     loading + lookups (data.ts), stats, related ranking, timelines, on-this-day
src/lib/ai/          corpus, BM25 retrieval, prompts, streaming helper
src/lib/search/      fuzzy matching (⌘K), list filters + NL rules parser
src/app/             pages and API routes (ask, summary, nl-filter, search-index, corrections)
src/components/      ui/, archive/, ask/, filters/, compare/, layout/, home/
scripts/import.ts    CSV/JSON import + validation
prisma/              Postgres schema (pgvector) and seed loader
```
