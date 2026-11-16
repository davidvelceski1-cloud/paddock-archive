import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge, Breadcrumbs, Container, PageHeader, PlaceholderNotice, Section } from "@/components/ui/primitives";
import { Crew, RichText, SourcesSection } from "@/components/archive/bits";
import { PhotoFigure } from "@/components/archive/Photo";
import { archive, href, ix, photoOf, racesAt, resolveCar, resolveDriver, resolveTeam, seasonLabel } from "@/lib/archive/data";
import { countryName } from "@/data/countries";
import { fmtDate, listJoin } from "@/lib/utils";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return archive().tracks.map((t) => ({ slug: t.id }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const t = ix().tracks.get((await params).slug);
  return t ? { title: t.name, description: t.tagline } : {};
}

export default async function TrackPage({ params }: { params: Params }) {
  const t = ix().tracks.get((await params).slug);
  if (!t) notFound();
  const { events, leMans } = racesAt(t.id);
  const photo = photoOf(`track:${t.id}`);
  const map = photoOf(`trackmap:${t.id}`);

  const specs: [string, string][] = [
    ["Length", `${t.lengthKm.toFixed(3)} km`],
    ["Corners", String(t.turns)],
    ["Opened", String(t.opened)],
    ["Location", `${t.location}, ${countryName(t.country)}`],
    ["Endurance racing", t.usage],
    ...(t.lapRecord ? ([["Lap record", t.lapRecord]] as [string, string][]) : []),
  ];

  return (
    <Container className="pt-10">
      <Breadcrumbs items={[{ label: "Tracks", href: "/tracks" }, { label: t.name }]} />
      <div className="grid items-end gap-8 lg:grid-cols-[minmax(0,1fr)_480px]">
        <PageHeader
          kicker={
            <>
              <Badge>{countryName(t.country)}</Badge>
              <Badge>Since {t.opened}</Badge>
              <PlaceholderNotice />
            </>
          }
          title={t.name}
        >
          {t.tagline}
        </PageHeader>
        <PhotoFigure photo={photo ?? map} priority />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <dl className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
          {specs.map(([k, v]) => (
            <div key={k} className={k === "Endurance racing" || k === "Lap record" || k === "Location" ? "card col-span-2 p-4 sm:col-span-1" : "card p-4"}>
              <dt className="text-muted-strong">{k}</dt>
              <dd className="tnum mt-1 font-medium text-ink">{v}</dd>
            </div>
          ))}
        </dl>
        {map && photo && (
          <div className="card p-3">
            <p className="px-1 pb-2 text-xs font-medium uppercase tracking-[0.12em] text-muted-strong">Layout</p>
            <div className="rounded-lg bg-white p-2">
              <PhotoFigure photo={map} aspect="card" className="[&_img]:object-contain" />
            </div>
          </div>
        )}
      </div>

      <Section title="History" kicker="The story of the circuit" id="history">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
          <RichText md={t.history} className="max-w-3xl text-[17px] leading-relaxed" />
          {t.layouts.length > 0 && (
            <aside aria-labelledby="layouts-h">
              <h3 id="layouts-h" className="text-xs font-medium uppercase tracking-[0.12em] text-muted-strong">
                Layouts
              </h3>
              <ol className="relative mt-3 space-y-5 border-l border-line pl-6">
                {t.layouts.map((l) => (
                  <li key={l.years} className="relative">
                    <span className="absolute -left-[29px] top-1.5 size-2.5 rounded-full border-2 border-[var(--bg)] bg-accent" aria-hidden />
                    <p className="tnum text-sm font-medium text-accent-ink">{l.years}</p>
                    <p className="mt-0.5 text-sm text-body">{l.text}</p>
                  </li>
                ))}
              </ol>
            </aside>
          )}
        </div>
      </Section>

      <Section title="Races held here" kicker={`${events.length + leMans.length} in the archive`} id="races">
        {events.length > 0 ? (
          <ul className="card divide-y divide-line">
            {events.map((e) => {
              const top = e.results.find((r) => r.classId === "overall")?.podium[0];
              return (
                <li key={e.id} className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 px-5 py-3.5">
                  <Link href={href.event(e.id)} className="font-medium text-ink hover:underline">
                    {seasonLabel(e.season)} {e.name}
                  </Link>
                  <span className="text-sm text-body">{top ? <Crew e={top} season={e.season} compact /> : <span className="text-muted-strong">Results not yet in the archive</span>}</span>
                  {e.date && <span className="tnum w-full text-xs text-muted-strong">{fmtDate(e.date, { day: "numeric", month: "long", year: "numeric" })}</span>}
                </li>
              );
            })}
          </ul>
        ) : (
          !leMans.length && <p className="card px-5 py-4 text-sm text-body">No races at this circuit are in the archive yet.</p>
        )}
        {leMans.length > 0 && (
          <div className="mt-6">
            <h3 className="mb-3 text-lg font-semibold text-ink">Every Le Mans winner</h3>
            <ul className="card grid divide-y divide-line sm:grid-cols-2 sm:divide-y-0">
              {leMans.map((l) => (
                <li key={l.year} className="flex gap-3 border-line px-5 py-2.5 text-sm sm:border-b">
                  <Link href={`/le-mans#d${Math.floor(l.year / 10) * 10}`} className="tnum w-12 shrink-0 font-semibold text-accent-ink hover:underline">
                    {l.year}
                  </Link>
                  <span className="text-body">
                    <span className="font-medium text-ink">{resolveCar(l.car).label}</span>
                    {l.team ? ` · ${resolveTeam(l.team).label}` : ""} — {listJoin(l.drivers.map((d) => resolveDriver(d).label))}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Section>

      <SourcesSection ids={t.sources} page={href.track(t.id)} />
    </Container>
  );
}
