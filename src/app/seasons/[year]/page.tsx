import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Trophy } from "lucide-react";
import { Badge, Breadcrumbs, Container, EmptyState, PageHeader, PlaceholderNotice, Section } from "@/components/ui/primitives";
import { DataTable, type Cell } from "@/components/ui/DataTable";
import { ClassTag, RelatedRail, RichText, Ref, Refs, SourcesSection } from "@/components/archive/bits";
import { AskContext, AskPrompts } from "@/components/ask/AskContext";
import { SummaryButton } from "@/components/ask/SummaryButton";
import { archive, className, eventsForSeason, href, ix, leMansForSeason, resolveAny, resolveCar, resolveDriver, resolveManufacturer, resolveTeam, seasonLabel } from "@/lib/archive/data";
import { countryName } from "@/data/countries";
import { fmtDate } from "@/lib/utils";

type Params = Promise<{ year: string }>;

export function generateStaticParams() {
  return archive()
    .seasons.filter((s) => s.status !== "not-held")
    .map((s) => ({ year: String(s.year) }));
}

const getSeason = (y: string) => (/^\d{4}$/.test(y) ? ix().seasons.get(Number(y)) : undefined);

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const s = getSeason((await params).year);
  if (!s) return {};
  const champ = s.championshipId ? ix().championships.get(s.championshipId)?.name : "24 Hours of Le Mans";
  return { title: `${seasonLabel(s.year)} season`, description: `${seasonLabel(s.year)} ${champ}: calendar, results, champions and the story of the season.` };
}

export default async function SeasonPage({ params }: { params: Params }) {
  const s = getSeason((await params).year);
  if (!s || s.status === "not-held") notFound();
  const a = archive();
  const label = seasonLabel(s.year);
  const champ = s.championshipId ? ix().championships.get(s.championshipId) : undefined;
  const era = ix().eras.get(s.eraSlug);
  const events = eventsForSeason(s.year);
  const lm = leMansForSeason(s.year);
  const years = a.seasons.filter((x) => x.status !== "not-held").map((x) => x.year);
  const i = years.indexOf(s.year);
  const prev = years[i - 1];
  const next = years[i + 1];

  const calendarRows: Record<string, Cell>[] = events.map((e) => {
    const overall = e.results.find((r) => r.classId === "overall");
    const w = overall?.podium[0];
    const classWins = e.results.filter((r) => r.classId !== "overall" && r.podium[0]);
    return {
      round: { v: e.round, sort: e.round },
      race: { v: e.name, href: href.event(e.id), sub: `${e.circuit}, ${countryName(e.country)}` },
      date: { v: fmtDate(e.date), sort: e.date ?? "" },
      winner: w ? { v: resolveTeam(w.team, s.year).label, sub: `#${w.number ?? "?"} · ${w.drivers.map((d) => resolveDriver(d).label).join(", ")}`, href: resolveTeam(w.team).href } : { v: null },
      classes: classWins.length ? { v: classWins.map((r) => `${ix().classes.get(r.classId)?.short}: ${resolveTeam(r.podium[0].team, s.year).label}`).join(" · ") } : { v: null },
      pole: overall?.pole ? { v: `#${overall.pole.number} ${resolveTeam(overall.pole.team, s.year).label}` } : { v: null },
      laps: { v: overall?.laps ?? null, sort: overall?.laps ?? -1 },
    };
  });

  const prompts = [`What happened in the ${label} season?`, `Who won Le Mans in ${lm.at(-1)?.year ?? s.year}?`, ...(s.champions.length ? [`How did the ${label} champions win the title?`] : [])];

  return (
    <Container className="pt-10">
      <AskContext kind="season" id={String(s.year)} label={`the ${label} season`} suggestions={prompts} />
      <Breadcrumbs items={[{ label: "Seasons", href: "/seasons" }, ...(era ? [{ label: era.name, href: href.era(era.slug) }] : []), { label }]} />

      <PageHeader
        kicker={
          <>
            {era && <Badge>{era.name}</Badge>}
            {s.status === "in-progress" && <Badge tone="accent">In progress</Badge>}
            <PlaceholderNotice />
          </>
        }
        title={label}
        actions={<SummaryButton kind="season" id={String(s.year)} />}
      >
        <p className="font-medium text-ink">{champ ? champ.name : "24 Hours of Le Mans — no world championship this year"}</p>
        {s.regulations && <p className="mt-2">{s.regulations}</p>}
        {!s.regulations && champ && s.status === "le-mans-only" && <p className="mt-2 text-sm">The archive holds this year's Le Mans result; other championship rounds are not yet imported.</p>}
      </PageHeader>

      <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
        {s.classes.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-muted-strong">Classes</span>
            {s.classes.map((c) => (
              <ClassTag key={c} id={c} />
            ))}
          </div>
        )}
        {s.rounds && (
          <p className="tnum text-body">
            <span className="text-muted-strong">Rounds</span> {s.rounds}
          </p>
        )}
      </div>

      <nav aria-label="Season navigation" className="mt-6 flex items-center justify-between gap-3 border-y border-line py-3 text-sm">
        {prev ? (
          <Link href={href.season(prev)} className="inline-flex items-center gap-1.5 text-body hover:text-ink">
            <ArrowLeft className="size-4" strokeWidth={1.5} aria-hidden /> {seasonLabel(prev)}
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link href={href.season(next)} className="inline-flex items-center gap-1.5 text-body hover:text-ink">
            {seasonLabel(next)} <ArrowRight className="size-4" strokeWidth={1.5} aria-hidden />
          </Link>
        )}
      </nav>

      <div className="mt-10 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <section aria-labelledby="story-h">
          <h2 id="story-h" className="mb-3 text-xl font-semibold tracking-tight">
            Story of the season
          </h2>
          {s.story ? (
            <RichText md={s.story} />
          ) : (
            <p className="text-body">
              {lm[0] ? (
                <>
                  The {lm[0].year} 24 Hours of Le Mans was won by <Ref r={resolveCar(lm[0].car)} /> ({resolveManufacturer(lm[0].manufacturer).label}) driven by <Refs items={lm[0].drivers.map(resolveDriver)} />. A full editorial
                  account of this season has not been written yet.
                </>
              ) : (
                "An editorial account of this season has not been written yet."
              )}
            </p>
          )}
          <AskPrompts className="mt-5" prompts={prompts.slice(0, 2)} />
        </section>

        <aside className="space-y-4" aria-label="Season honours">
          {s.champions.map((c) => (
            <div key={c.classId} className="card p-5">
              <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.12em] text-muted-strong">
                <Trophy className="size-4 text-[var(--gt-ink)]" strokeWidth={1.5} aria-hidden /> {className(c.classId)} world champions
              </p>
              {c.drivers && (
                <p className="mt-2 text-[15px] text-ink">
                  <Refs items={c.drivers.map(resolveDriver)} />
                </p>
              )}
              <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
                {c.team && (
                  <>
                    <dt className="text-muted-strong">Team</dt>
                    <dd>
                      <Ref r={resolveTeam(c.team, s.year)} />
                    </dd>
                  </>
                )}
                {c.car && (
                  <>
                    <dt className="text-muted-strong">Car</dt>
                    <dd>
                      <Ref r={resolveCar(c.car)} />
                    </dd>
                  </>
                )}
                {c.manufacturer && (
                  <>
                    <dt className="text-muted-strong">Manufacturers&apos;</dt>
                    <dd>
                      <Ref r={resolveManufacturer(c.manufacturer)} />
                    </dd>
                  </>
                )}
              </dl>
            </div>
          ))}
          {lm.map((l) => (
            <div key={l.year} className="card p-5">
              <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-strong">{l.year} 24 Hours of Le Mans</p>
              <p className="mt-2 text-[15px] text-ink">
                <Ref r={resolveCar(l.car)} />
                {l.number && <span className="tnum text-muted-strong"> #{l.number}</span>}
              </p>
              <p className="mt-1 text-sm text-body">
                <Refs items={l.drivers.map(resolveDriver)} />
              </p>
              {l.team && <p className="mt-1 text-sm text-muted-strong">{resolveTeam(l.team, s.year).label}</p>}
            </div>
          ))}
        </aside>
      </div>

      <Section title="Race calendar" kicker={events.length ? `${events.length} rounds` : undefined} id="calendar">
        {events.length ? (
          <DataTable
            caption={`${label} race calendar and winners`}
            initialSort={{ key: "round", dir: "asc" }}
            columns={[
              { key: "round", label: "Rd", numeric: true },
              { key: "race", label: "Race" },
              { key: "date", label: "Date" },
              { key: "winner", label: "Overall winner" },
              { key: "classes", label: "Class winners", sortable: false },
              { key: "pole", label: "Pole" },
              { key: "laps", label: "Laps", numeric: true },
            ]}
            rows={calendarRows}
          />
        ) : (
          <EmptyState title="Race-by-race results aren't in the archive yet">
            {s.status === "in-progress" ? "This season is under way. Results appear once they are imported and verified." : "This season's calendar can be loaded with the import script — see the README."}
          </EmptyState>
        )}
        {events.some((e) => !e.results.length) && <p className="mt-3 text-xs text-muted-strong">Rows marked — have no verified result in the archive yet.</p>}
      </Section>

      {s.standings.length > 0 && (
        <Section title="Championship standings" id="standings">
          <div className="grid gap-6 lg:grid-cols-2">
            {s.standings.map((t) => (
              <div key={`${t.classId}-${t.kind}`}>
                <h3 className="mb-2 flex items-center gap-2 text-sm font-medium text-ink">
                  <ClassTag id={t.classId} /> {t.kind === "drivers" ? "Drivers" : t.kind === "manufacturers" ? "Manufacturers" : "Teams"}
                  {!t.complete && <span className="text-xs font-normal text-muted-strong">· partial</span>}
                </h3>
                <DataTable
                  dense
                  caption={`${label} ${className(t.classId)} ${t.kind} standings`}
                  initialSort={{ key: "pos", dir: "asc" }}
                  columns={[
                    { key: "pos", label: "Pos", numeric: true },
                    { key: "entrant", label: t.kind === "drivers" ? "Drivers" : t.kind === "manufacturers" ? "Manufacturer" : "Team" },
                    { key: "car", label: "Car" },
                    { key: "points", label: "Pts", numeric: true },
                  ]}
                  rows={t.rows.map((r) => ({
                    pos: { v: r.pos },
                    entrant: { v: r.entrant.join(), links: r.entrant.map((x) => resolveAny(x, s.year)) },
                    car: r.car ? { v: resolveCar(r.car).label, href: resolveCar(r.car).href } : { v: null },
                    points: { v: r.points ?? null, sort: r.points ?? -1 },
                  }))}
                />
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-muted-strong">Points totals are not yet imported for seed seasons.</p>
        </Section>
      )}

      {s.regulationChanges.length > 0 && (
        <Section title="Regulation changes" kicker={prev ? `vs ${seasonLabel(prev)}` : undefined} id="regs">
          <ul className="card divide-y divide-line">
            {s.regulationChanges.map((r) => (
              <li key={r} className="flex gap-3 px-5 py-3 text-[15px] text-body">
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
                {r}
              </li>
            ))}
          </ul>
        </Section>
      )}

      <RelatedRail entityKey={`season:${s.year}`} />
      <SourcesSection ids={[...s.sources, ...events.flatMap((e) => e.sources)]} page={href.season(s.year)} />
    </Container>
  );
}
