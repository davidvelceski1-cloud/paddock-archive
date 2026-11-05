import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge, Breadcrumbs, Container, PageHeader, PlaceholderNotice, Section, StatTile } from "@/components/ui/primitives";
import { ClassTag, Ref, RelatedRail, SourcesSection } from "@/components/archive/bits";
import { AskContext } from "@/components/ask/AskContext";
import { SummaryButton } from "@/components/ask/SummaryButton";
import { archive, className, href, ix, resolveDriver, resolveManufacturer, resolveTeam, seasonLabel, seasonOfLeMans } from "@/lib/archive/data";
import { carStats } from "@/lib/archive/stats";
import { listJoin } from "@/lib/utils";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return archive().cars.map((c) => ({ slug: c.id }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const c = ix().cars.get((await params).slug);
  return c ? { title: c.name, description: c.summary } : {};
}

export default async function CarPage({ params }: { params: Params }) {
  const c = ix().cars.get((await params).slug);
  if (!c) notFound();
  const s = carStats(c.id);
  const a = archive();
  const years = c.to === c.from ? `${c.from}` : `${c.from}–${c.to ?? "today"}`;
  const lm = a.leMans.filter((l) => l.car === c.id);

  return (
    <Container className="pt-10">
      <AskContext kind="car" id={c.id} label={c.name} suggestions={[`What made the ${c.name} special?`, `Which teams raced the ${c.name}?`]} />
      <Breadcrumbs items={[{ label: "Cars", href: "/cars" }, { label: resolveManufacturer(c.manufacturerId).label, href: href.manufacturer(c.manufacturerId) }, { label: c.name }]} />
      <PageHeader
        kicker={
          <>
            <ClassTag id={c.classId} />
            <Badge>{years}</Badge>
            <PlaceholderNotice />
          </>
        }
        title={c.name}
        actions={<SummaryButton kind="car" id={c.id} />}
      >
        {c.summary}
      </PageHeader>

      <dl className="mt-8 grid gap-4 text-sm sm:grid-cols-3">
        <div className="card p-4">
          <dt className="text-muted-strong">Manufacturer</dt>
          <dd className="mt-1 font-medium">
            <Ref r={resolveManufacturer(c.manufacturerId)} />
          </dd>
        </div>
        <div className="card p-4">
          <dt className="text-muted-strong">Class</dt>
          <dd className="mt-1 font-medium text-ink">{className(c.classId)}</dd>
        </div>
        <div className="card p-4">
          <dt className="text-muted-strong">Years raced</dt>
          <dd className="tnum mt-1 font-medium text-ink">{years}</dd>
        </div>
        <div className="card p-4 sm:col-span-3">
          <dt className="text-muted-strong">Powertrain</dt>
          <dd className="mt-1 text-ink">{c.powertrain}</dd>
        </div>
      </dl>

      <Section title="Notable results" id="results">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <StatTile label="Le Mans wins" value={s.leMansWins.length} note={s.leMansWins.join(", ") || undefined} />
          <StatTile label="Wins" value={s.wins.filter((w) => w.classId === "overall" || w.classId === c.classId).length} note="In loaded races" />
          <StatTile label="Podiums" value={s.podiums.length} note="In loaded races" />
        </div>
        {(lm.length > 0 || s.wins.length > 0) && (
          <ul className="card mt-4 divide-y divide-line">
            {lm.map((l) => (
              <li key={l.year} className="px-5 py-3 text-sm">
                <span className="tnum font-medium text-ink">{l.year} 24 Hours of Le Mans</span> <span className="text-muted-strong">· overall winner ·</span> {listJoin(l.drivers.map((d) => resolveDriver(d).label))}
              </li>
            ))}
            {s.wins
              .filter((w) => !w.event.name.includes("Le Mans") || w.classId !== "overall")
              .map((w) => (
                <li key={w.event.id + w.classId} className="flex flex-wrap items-baseline justify-between gap-2 px-5 py-3 text-sm">
                  <Link href={href.event(w.event.id)} className="font-medium text-ink hover:underline">
                    {seasonLabel(w.event.season)} {w.event.name}
                  </Link>
                  <span className="text-muted-strong">{w.classId === "overall" ? "Overall win" : `${className(w.classId)} class win`}</span>
                </li>
              ))}
          </ul>
        )}
      </Section>

      <div className="mt-14 grid gap-8 lg:grid-cols-2">
        <section aria-labelledby="teams-h">
          <h2 id="teams-h" className="mb-4 text-xl font-semibold tracking-tight">
            Teams that ran it
          </h2>
          {s.teamIds.length ? (
            <ul className="card divide-y divide-line">
              {s.teamIds.map((t) => (
                <li key={t} className="flex items-center justify-between gap-3 px-5 py-3">
                  <Ref r={resolveTeam(t)} />
                  <span className="tnum text-sm text-muted-strong">
                    {[...new Set(a.teamEntries.filter((e) => e.teamId === t && e.car === c.id).map((e) => seasonLabel(e.season)))].join(", ")}
                  </span>
                </li>
              ))}
            </ul>
          ) : lm.some((l) => l.team) ? (
            <ul className="card divide-y divide-line">
              {lm
                .filter((l) => l.team)
                .map((l) => (
                  <li key={l.year} className="flex justify-between px-5 py-3">
                    <Ref r={resolveTeam(l.team!, seasonOfLeMans(l.year))} />
                    <span className="tnum text-sm text-muted-strong">{l.year}</span>
                  </li>
                ))}
            </ul>
          ) : (
            <p className="card px-5 py-4 text-sm text-body">Entrants for this car are not yet in the archive.</p>
          )}
        </section>
        <section aria-labelledby="drivers-h">
          <h2 id="drivers-h" className="mb-4 text-xl font-semibold tracking-tight">
            Drivers
          </h2>
          {s.driverIds.length ? (
            <p className="card px-5 py-4 leading-relaxed">
              {s.driverIds.map((d, i) => (
                <span key={d}>
                  {i > 0 && ", "}
                  <Ref r={resolveDriver(d)} />
                </span>
              ))}
            </p>
          ) : (
            <p className="card px-5 py-4 text-sm text-body">Season line-ups for this car are not yet imported.</p>
          )}
        </section>
      </div>

      <RelatedRail entityKey={`car:${c.id}`} />
      <SourcesSection ids={c.sources} page={href.car(c.id)} />
    </Container>
  );
}
