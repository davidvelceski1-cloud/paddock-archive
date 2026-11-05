import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge, Breadcrumbs, Container, PageHeader, PlaceholderNotice, Section, StatTile, StatusBadge } from "@/components/ui/primitives";
import { CareerTimeline, type TimelineRow } from "@/components/archive/CareerTimeline";
import { ClassTag, Ref, SourcesSection } from "@/components/archive/bits";
import { AskContext } from "@/components/ask/AskContext";
import { SummaryButton } from "@/components/ask/SummaryButton";
import { archive, className, classFamily, href, ix, resolveDriver, seasonEndYear, seasonLabel, teamDisplayName } from "@/lib/archive/data";
import { manufacturerStats } from "@/lib/archive/stats";
import { countryName } from "@/data/countries";
import { listJoin } from "@/lib/utils";
import { LEMANS_SOURCES } from "@/data/seed/reference";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return archive().manufacturers.map((m) => ({ slug: m.id }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const m = ix().manufacturers.get((await params).slug);
  return m ? { title: m.name, description: m.summary } : {};
}

/** Participation across eras: team entries plus Le Mans wins, one row per season. */
function participation(id: string): TimelineRow[] {
  const a = archive();
  const rows = new Map<number, TimelineRow>();
  const carIds = new Set(a.cars.filter((c) => c.manufacturerId === id).map((c) => c.id));
  for (const e of a.teamEntries.filter((e) => carIds.has(e.car) || ix().teams.get(e.teamId)?.manufacturerIds.includes(id))) {
    const row = rows.get(e.season) ?? { year: e.season, label: seasonLabel(e.season), href: href.season(e.season), segments: [] };
    if (!row.segments.some((s) => s.classLabel === className(e.classId))) {
      const t = ix().teams.get(e.teamId)!;
      row.segments.push({ family: classFamily(e.classId), classLabel: className(e.classId), title: teamDisplayName(t), href: href.team(t.id) });
    }
    rows.set(e.season, row);
  }
  for (const l of a.leMans.filter((l) => l.manufacturer === id)) {
    if ([...rows.values()].some((r) => r.label.includes(String(l.year)) || r.year === l.year)) continue;
    const cls = ix().cars.get(l.car)?.classId ?? (l.year <= 1981 ? "prototype" : l.year <= 1992 ? "group-c" : "lmp1");
    rows.set(l.year, { year: l.year, label: String(l.year), href: ix().seasons.has(l.year) ? href.season(l.year) : undefined, segments: [{ family: classFamily(cls), classLabel: "Le Mans win", title: listJoin(l.drivers.map((d) => resolveDriver(d).label)) }] });
  }
  return [...rows.values()].sort((x, y) => x.year - y.year);
}

export default async function ManufacturerPage({ params }: { params: Params }) {
  const m = ix().manufacturers.get((await params).slug);
  if (!m) notFound();
  const s = manufacturerStats(m.id);
  const rows = participation(m.id);
  const eras = archive().eras.filter((e) => rows.some((r) => r.year >= e.from && r.year <= (e.to ?? 9999)));

  return (
    <Container className="pt-10">
      <AskContext kind="manufacturer" id={m.id} label={m.name} suggestions={[`What is ${m.name}'s endurance racing history?`, `When did ${m.name} win Le Mans?`]} />
      <Breadcrumbs items={[{ label: "Cars & manufacturers", href: "/cars#manufacturers" }, { label: m.name }]} />
      <PageHeader
        kicker={
          <>
            <Badge>{countryName(m.country)}</Badge>
            <PlaceholderNotice />
          </>
        }
        title={m.name}
        actions={<SummaryButton kind="manufacturer" id={m.id} />}
      >
        {m.summary}
      </PageHeader>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatTile label="Le Mans wins" value={s.leMansWins.length} href="/le-mans" note={s.leMansWins.length ? `${s.leMansWins[0]}–${s.leMansWins.at(-1)}` : undefined} />
        <StatTile label="Manufacturers' titles" value={s.titles.length} note={s.titles.map(seasonLabel).join(", ") || "WEC era"} />
        <StatTile label="Cars profiled" value={s.cars.length} />
        <StatTile label="Eras raced" value={eras.length} />
      </div>

      {rows.length > 0 && (
        <Section title="Participation across eras" id="participation">
          <CareerTimeline title={`${m.name} participation`} rows={rows} />
          {eras.length > 0 && (
            <ul className="mt-4 flex flex-wrap gap-2">
              {eras.map((e) => (
                <li key={e.slug}>
                  <Link href={href.era(e.slug)} className="rounded-full border border-line bg-surface px-3 py-1 text-sm text-body hover:text-ink">
                    {e.name}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Section>
      )}

      {s.cars.length > 0 && (
        <Section title="Cars" id="cars">
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {s.cars.map((c) => (
              <li key={c.id}>
                <Link href={href.car(c.id)} className="card card-link flex h-full flex-col p-4">
                  <span className="flex items-center justify-between">
                    <ClassTag id={c.classId} />
                    <span className="tnum text-xs text-muted-strong">
                      {c.from}
                      {c.to !== c.from && `–${c.to ?? ""}`}
                    </span>
                  </span>
                  <span className="mt-2 font-medium text-ink">{c.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {s.teams.length > 0 && (
        <Section title="Teams" id="teams">
          <ul className="card divide-y divide-line">
            {s.teams.map((t) => (
              <li key={t.id} className="flex items-center justify-between gap-3 px-5 py-3">
                <Ref r={{ label: teamDisplayName(t), href: href.team(t.id) }} />
                <StatusBadge status={t.status} until={t.lastSeason ? seasonEndYear(t.lastSeason) : null} />
              </li>
            ))}
          </ul>
        </Section>
      )}

      <SourcesSection ids={[...m.sources, ...LEMANS_SOURCES]} page={href.manufacturer(m.id)} />
    </Container>
  );
}
