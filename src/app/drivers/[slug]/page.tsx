import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Trophy } from "lucide-react";
import { Badge, Breadcrumbs, Container, PageHeader, PlaceholderNotice, Section, StatTile, StatusBadge } from "@/components/ui/primitives";
import { CareerTimeline } from "@/components/archive/CareerTimeline";
import { Ref, RelatedRail, SourcesSection } from "@/components/archive/bits";
import { AskContext, AskPrompts } from "@/components/ask/AskContext";
import { SummaryButton } from "@/components/ask/SummaryButton";
import { archive, href, ix, resolveCar, resolveDriver, resolveTeam, seasonLabel, seasonOfLeMans } from "@/lib/archive/data";
import { coverage, driverStats, teammates } from "@/lib/archive/stats";
import { driverTimeline } from "@/lib/archive/timelines";
import { countryName, demonym } from "@/data/countries";
import { SITE_URL, listJoin } from "@/lib/utils";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return archive().drivers.map((d) => ({ slug: d.id }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const d = ix().drivers.get((await params).slug);
  return d ? { title: d.name, description: d.bio } : {};
}

export default async function DriverPage({ params }: { params: Params }) {
  const d = ix().drivers.get((await params).slug);
  if (!d) notFound();
  const s = driverStats(d.id);
  const mates = teammates(d.id);
  const cov = coverage();
  const lm = archive().leMans.filter((l) => l.drivers.includes(d.id));
  const careerYears = [...s.seasons, ...lm.map((l) => l.year)];
  const span = careerYears.length ? `${Math.min(...careerYears)}–${d.status === "active" ? "today" : Math.max(...careerYears)}` : "—";

  const jsonLd = { "@context": "https://schema.org", "@type": "Person", name: d.name, nationality: countryName(d.nationality), birthDate: d.birthYear ? String(d.birthYear) : undefined, url: `${SITE_URL}${href.driver(d.id)}` };

  return (
    <Container className="pt-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <AskContext kind="driver" id={d.id} label={d.name} suggestions={[`Summarise ${d.name}'s career`, `Who were ${d.name}'s teammates?`, `What did ${d.name} win at Le Mans?`]} />
      <Breadcrumbs items={[{ label: "Drivers", href: "/drivers" }, { label: d.name }]} />

      <PageHeader
        kicker={
          <>
            <StatusBadge status={d.status} />
            <Badge>{demonym(d.nationality)}</Badge>
            <PlaceholderNotice />
          </>
        }
        title={d.name}
        actions={<SummaryButton kind="driver" id={d.id} />}
      >
        {d.bio}
      </PageHeader>

      <dl className="mt-8 grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
        {[
          ["Nationality", countryName(d.nationality)],
          ["Born", d.birthYear ? String(d.birthYear) : "—"],
          ["Active in archive", span],
          ["Teams", s.teams.length ? String(s.teams.length) : "—"],
        ].map(([k, v]) => (
          <div key={k} className="card p-4">
            <dt className="text-muted-strong">{k}</dt>
            <dd className="tnum mt-1 font-medium text-ink">{v}</dd>
          </div>
        ))}
      </dl>

      <Section title="Career timeline" kicker="Season by season" id="timeline">
        <CareerTimeline title={`${d.name} career timeline`} rows={driverTimeline(d.id)} />
        {!s.entries.length && <p className="mt-3 text-sm text-muted-strong">Season-by-season entries for this driver aren&apos;t imported yet; the timeline shows Le Mans victories from the honour roll.</p>}
      </Section>

      <Section title="Stats" id="stats">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          <StatTile label="WEC seasons" value={s.seasons.length} />
          <StatTile label="World titles" value={s.titles.length} note={s.titles.map(seasonLabel).join(", ") || undefined} />
          <StatTile label="Le Mans wins" value={s.leMansWins.length} note={s.leMansWins.join(", ") || undefined} href="/le-mans" />
          <StatTile label="Wins" value={s.wins.length} note="In loaded races" />
          <StatTile label="Podiums" value={s.podiums.length} note="In loaded races" />
          <StatTile label="Poles" value={s.poles.length} note="In loaded races" />
        </div>
        <p className="mt-3 text-xs text-muted-strong">Race-level stats count only the {cov.loaded} races with results in the archive. Starts are not yet imported.</p>
      </Section>

      {lm.length > 0 && (
        <Section title="Le Mans results" id="lemans">
          <ul className="card divide-y divide-line">
            {lm.map((l) => {
              const key = seasonOfLeMans(l.year);
              return (
                <li key={l.year} className="flex flex-wrap items-center justify-between gap-3 px-5 py-3">
                  <span className="flex items-center gap-3">
                    <Trophy className="size-4 text-[var(--gt-ink)]" strokeWidth={1.5} aria-hidden />
                    <span className="tnum font-medium text-ink">{key ? <Link href={href.season(key)}>{l.year}</Link> : l.year}</span>
                    <span className="text-body">
                      Winner · <Ref r={resolveCar(l.car)} />
                    </span>
                  </span>
                  <span className="text-sm text-muted-strong">with {listJoin(l.drivers.filter((x) => x !== d.id).map((x) => resolveDriver(x).label))}</span>
                </li>
              );
            })}
          </ul>
        </Section>
      )}

      <div className="mt-14 grid gap-8 lg:grid-cols-2">
        <section aria-labelledby="mates-h">
          <h2 id="mates-h" className="mb-4 text-xl font-semibold tracking-tight">
            Teammates
          </h2>
          {mates.length ? (
            <ul className="card divide-y divide-line">
              {mates.slice(0, 14).map((m) => (
                <li key={m.driver} className="flex items-center justify-between gap-3 px-5 py-3">
                  <Ref r={resolveDriver(m.driver)} />
                  <span className="tnum text-sm text-muted-strong">{m.years.map(seasonLabel).join(", ")}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="card px-5 py-4 text-sm text-body">No teammates recorded yet.</p>
          )}
        </section>
        <section aria-labelledby="cars-h">
          <h2 id="cars-h" className="mb-4 text-xl font-semibold tracking-tight">
            Teams & cars
          </h2>
          {s.entries.length ? (
            <ul className="card divide-y divide-line">
              {[...new Set(s.entries.map((e) => `${e.team}|${e.car}`))].map((k) => {
                const [team, car] = k.split("|");
                const ys = s.entries.filter((e) => e.team === team && e.car === car).map((e) => seasonLabel(e.season));
                return (
                  <li key={k} className="flex flex-wrap items-center justify-between gap-3 px-5 py-3">
                    <span>
                      <Ref r={resolveTeam(team)} /> <span className="text-muted-strong">·</span> <Ref r={resolveCar(car)} className="text-body" />
                    </span>
                    <span className="tnum text-sm text-muted-strong">{[...new Set(ys)].join(", ")}</span>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="card px-5 py-4 text-sm text-body">Team entries are not yet imported for this driver.</p>
          )}
        </section>
      </div>

      <AskPrompts className="mt-10" prompts={[`Summarise ${d.name}'s career`, `Compare ${d.name} with a teammate`]} />
      <RelatedRail entityKey={`driver:${d.id}`} />
      <SourcesSection ids={d.sources} page={href.driver(d.id)} />
    </Container>
  );
}
