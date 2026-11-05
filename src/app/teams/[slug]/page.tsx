import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DoorOpen } from "lucide-react";
import { Badge, Breadcrumbs, Container, PageHeader, PlaceholderNotice, Section, StatTile, StatusBadge } from "@/components/ui/primitives";
import { CareerTimeline } from "@/components/archive/CareerTimeline";
import { ClassTag, Ref, RelatedRail, SourcesSection } from "@/components/archive/bits";
import { AskContext, AskPrompts } from "@/components/ask/AskContext";
import { SummaryButton } from "@/components/ask/SummaryButton";
import { archive, href, ix, resolveCar, resolveDriver, resolveManufacturer, seasonEndYear, seasonLabel, teamDisplayName } from "@/lib/archive/data";
import { coverage, teamStats } from "@/lib/archive/stats";
import { teamTimeline } from "@/lib/archive/timelines";
import { countryName } from "@/data/countries";
import { SITE_URL } from "@/lib/utils";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return archive().teams.map((t) => ({ slug: t.id }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const t = ix().teams.get((await params).slug);
  return t ? { title: teamDisplayName(t), description: t.tagline } : {};
}

export default async function TeamPage({ params }: { params: Params }) {
  const t = ix().teams.get((await params).slug);
  if (!t) notFound();
  const s = teamStats(t.id);
  const cov = coverage();
  const name = teamDisplayName(t);
  const end = t.lastSeason ? seasonEndYear(t.lastSeason) : null;
  const driverSeasons = new Map<string, number[]>();
  for (const e of archive().driverEntries.filter((e) => e.team === t.id)) driverSeasons.set(e.driverId, [...new Set([...(driverSeasons.get(e.driverId) ?? []), e.season])]);
  const drivers = [...driverSeasons.entries()].sort((a, b) => b[1].length - a[1].length || a[0].localeCompare(b[0]));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SportsTeam",
    name,
    alternateName: t.names.slice(0, -1).map((n) => n.name),
    sport: "Endurance motor racing",
    foundingDate: String(t.firstSeason),
    url: `${SITE_URL}${href.team(t.id)}`,
  };

  return (
    <Container className="pt-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <AskContext kind="team" id={t.id} label={name} suggestions={[`Summarise ${name}'s history`, `Who drove for ${name}?`, ...(t.status === "defunct" ? [`Why did ${name} leave?`] : [`How has ${name} done in recent seasons?`])]} />
      <Breadcrumbs items={[{ label: "Teams", href: "/teams" }, { label: name }]} />

      <PageHeader
        kicker={
          <>
            <StatusBadge status={t.status} until={end} />
            <Badge>{countryName(t.country)}</Badge>
            <PlaceholderNotice />
          </>
        }
        title={name}
        actions={<SummaryButton kind="team" id={t.id} />}
      >
        {t.tagline}
      </PageHeader>

      <dl className="mt-8 grid gap-4 text-sm sm:grid-cols-3">
        <div className="card p-4">
          <dt className="text-muted-strong">Years active</dt>
          <dd className="tnum mt-1 font-medium text-ink">
            {t.firstSeason}–{end ?? "today"}
          </dd>
        </div>
        <div className="card p-4">
          <dt className="text-muted-strong">Manufacturer{t.manufacturerIds.length > 1 ? "s" : ""}</dt>
          <dd className="mt-1 font-medium">
            {t.manufacturerIds.map((m, i) => (
              <span key={m}>
                {i > 0 && ", "}
                <Ref r={resolveManufacturer(m)} />
              </span>
            ))}
          </dd>
        </div>
        <div className="card p-4">
          <dt className="text-muted-strong">Names over time</dt>
          <dd className="mt-1">
            <ol className="space-y-0.5">
              {t.names.map((n) => (
                <li key={n.name + n.from} className="flex justify-between gap-3">
                  <span className="font-medium text-ink">{n.name}</span>
                  <span className="tnum text-muted-strong">
                    {n.from}–{n.to ?? "today"}
                  </span>
                </li>
              ))}
            </ol>
          </dd>
        </div>
      </dl>

      <Section title="Career timeline" kicker="Season by season" id="timeline">
        <CareerTimeline title={`${name} career timeline`} rows={teamTimeline(t.id)} />
      </Section>

      <Section title="Key stats" id="stats">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          <StatTile label="Seasons" value={s.seasons.length} />
          <StatTile label="World titles" value={s.titles.length} note={s.titles.length ? s.titles.map(seasonLabel).join(", ") : "Drivers' titles by team crews"} />
          <StatTile label="Le Mans wins" value={s.leMansWins.length} note={s.leMansWins.join(", ") || undefined} href="/le-mans" />
          <StatTile label="Wins" value={s.wins.length} note="In loaded races" />
          <StatTile label="Podiums" value={s.podiums.length} note="In loaded races" />
          <StatTile label="Poles" value={s.poles.length} note="In loaded races" />
        </div>
        <p className="mt-3 text-xs text-muted-strong">
          Race-level stats count only the {cov.loaded} races with results in the archive (seasons {cov.seasons.map(seasonLabel).join(", ")}). Titles and Le Mans wins are complete for the WEC era.
        </p>
      </Section>

      <div className="mt-14 grid gap-8 lg:grid-cols-2">
        <section aria-labelledby="cars-h">
          <h2 id="cars-h" className="mb-4 text-xl font-semibold tracking-tight">
            Cars raced
          </h2>
          <ul className="card divide-y divide-line">
            {s.cars.map((c) => {
              const entries = s.entries.filter((e) => e.car === c);
              const r = resolveCar(c);
              return (
                <li key={c} className="flex items-center justify-between gap-3 px-5 py-3">
                  <span className="flex items-center gap-2">
                    <ClassTag id={entries[0].classId} />
                    <Ref r={r} />
                  </span>
                  <span className="tnum text-sm text-muted-strong">{[...new Set(entries.map((e) => seasonLabel(e.season)))].join(", ")}</span>
                </li>
              );
            })}
          </ul>
        </section>
        <section aria-labelledby="drivers-h">
          <h2 id="drivers-h" className="mb-4 text-xl font-semibold tracking-tight">
            Drivers
          </h2>
          {drivers.length ? (
            <ul className="card divide-y divide-line">
              {drivers.map(([d, years]) => (
                <li key={d} className="flex items-center justify-between gap-3 px-5 py-3">
                  <Ref r={resolveDriver(d)} />
                  <span className="tnum text-sm text-muted-strong">{years.sort().map(seasonLabel).join(", ")}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="card px-5 py-4 text-sm text-body">Driver line-ups for this team are not yet in the archive.</p>
          )}
        </section>
      </div>

      <Section title="History" id="history">
        <div className="grid gap-6 lg:grid-cols-3">
          {(
            [
              ["Founding", t.history.founding],
              ["Peak", t.history.peak],
              ...(t.history.exit ? [[t.status === "defunct" ? "Decline & exit" : "Interruptions", t.history.exit]] : []),
            ] as [string, string][]
          ).map(([h, body]) => (
            <div key={h}>
              <h3 className="text-xs font-medium uppercase tracking-[0.12em] text-muted-strong">{h}</h3>
              <p className="mt-2 leading-relaxed text-body">{body}</p>
            </div>
          ))}
        </div>
        {t.whyLeft && (
          <div className="card mt-8 border-l-4 p-5" style={{ borderLeftColor: "var(--accent-3)" }}>
            <h3 className="flex items-center gap-2 font-semibold text-ink">
              <DoorOpen className="size-4 text-[var(--accent-3)]" strokeWidth={1.5} aria-hidden />
              {t.status === "defunct" ? "Why they left" : "Why they left — and came back"}
            </h3>
            <p className="mt-2 leading-relaxed text-body">{t.whyLeft}</p>
          </div>
        )}
        <AskPrompts className="mt-6" prompts={[t.status === "defunct" ? `Why did ${name} leave?` : `What are ${name}'s biggest wins?`, `Who were ${name}'s main rivals?`]} />
      </Section>

      {t.moments.length > 0 && (
        <Section title="Notable moments & records" id="moments">
          <ol className="relative space-y-5 border-l border-line pl-6">
            {t.moments.map((m) => (
              <li key={m.year + m.text} className="relative">
                <span className="absolute -left-[29px] top-1.5 size-2.5 rounded-full border-2 border-[var(--bg)] bg-accent" aria-hidden />
                <Link href={href.season(m.year === 2020 ? 2019 : m.year)} className="tnum text-sm font-medium text-accent-ink hover:underline">
                  {m.year}
                </Link>
                <p className="mt-0.5 text-body">{m.text}</p>
              </li>
            ))}
          </ol>
        </Section>
      )}

      <RelatedRail entityKey={`team:${t.id}`} />
      <SourcesSection ids={t.sources} page={href.team(t.id)} />
    </Container>
  );
}
