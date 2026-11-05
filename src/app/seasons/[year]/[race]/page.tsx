import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Flag, Timer } from "lucide-react";
import { Badge, Breadcrumbs, Container, EmptyState, PageHeader, PlaceholderNotice, Section } from "@/components/ui/primitives";
import { ClassTag, Crew, SourcesSection } from "@/components/archive/bits";
import { AskContext, AskPrompts } from "@/components/ask/AskContext";
import { archive, className, eventSlug, eventsForSeason, href, ix, seasonLabel } from "@/lib/archive/data";
import { countryName } from "@/data/countries";
import { fmtDate, ordinal } from "@/lib/utils";

type Params = Promise<{ year: string; race: string }>;

export function generateStaticParams() {
  return archive().events.map((e) => ({ year: String(e.season), race: eventSlug(e.id) }));
}

const getEvent = async (params: Params) => {
  const { year, race } = await params;
  return ix().events.get(`${year}-${race}`);
};

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const e = await getEvent(params);
  return e ? { title: `${seasonLabel(e.season)} ${e.name}`, description: `Results of the ${seasonLabel(e.season)} ${e.name} at ${e.circuit}.` } : {};
}

export default async function RacePage({ params }: { params: Params }) {
  const e = await getEvent(params);
  if (!e) notFound();
  const label = seasonLabel(e.season);
  const all = eventsForSeason(e.season);
  const i = all.findIndex((x) => x.id === e.id);
  const prev = all[i - 1];
  const next = all[i + 1];
  const title = `${label} ${e.name}`;

  return (
    <Container className="pt-10">
      <AskContext kind="event" id={e.id} label={title} suggestions={[`Tell me about the ${title}`, `How did the ${label} season unfold after this race?`]} />
      <Breadcrumbs items={[{ label: "Seasons", href: "/seasons" }, { label, href: href.season(e.season) }, { label: e.name }]} />
      <PageHeader
        kicker={
          <>
            <Badge>Round {e.round}</Badge>
            <Badge>{e.format}</Badge>
            <PlaceholderNotice />
          </>
        }
        title={e.name}
      >
        <p>
          {e.circuit}, {countryName(e.country)} · <span className="tnum">{fmtDate(e.date, { day: "numeric", month: "long", year: "numeric" })}</span>
        </p>
        {e.summary && <p className="mt-3">{e.summary}</p>}
      </PageHeader>

      <Section title="Results" id="results">
        {e.results.length ? (
          <div className="grid gap-4 lg:grid-cols-2">
            {e.results.map((r) => (
              <section key={r.classId} className="card p-5" aria-label={`${className(r.classId)} results`}>
                <div className="mb-3 flex items-center justify-between gap-2">
                  <h3 className="flex items-center gap-2 font-semibold text-ink">
                    <ClassTag id={r.classId} /> {r.classId === "overall" ? "Overall" : `${className(r.classId)} class`}
                  </h3>
                  {r.laps && (
                    <span className="tnum inline-flex items-center gap-1 text-sm text-muted-strong">
                      <Timer className="size-3.5" strokeWidth={1.5} aria-hidden /> {r.laps} laps
                    </span>
                  )}
                </div>
                <ol className="space-y-3">
                  {r.podium.map((p, pi) => (
                    <li key={pi} className="flex gap-3">
                      <span className={`tnum mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${pi === 0 ? "btn-grad" : "bg-surface-2 text-body"}`}>{ordinal(pi + 1)}</span>
                      <Crew e={p} season={e.season} />
                    </li>
                  ))}
                </ol>
                {r.podium.length < 3 && <p className="mt-3 text-xs text-muted-strong">Lower positions not yet in the archive.</p>}
                {(r.pole || r.fastestLap) && (
                  <dl className="mt-4 grid gap-2 border-t border-line pt-3 text-sm">
                    {r.pole && (
                      <div className="flex gap-2">
                        <dt className="flex w-24 shrink-0 items-center gap-1 text-muted-strong">
                          <Flag className="size-3.5" strokeWidth={1.5} aria-hidden /> Pole
                        </dt>
                        <dd>
                          <Crew e={r.pole} season={e.season} compact />
                        </dd>
                      </div>
                    )}
                    {r.fastestLap && (
                      <div className="flex gap-2">
                        <dt className="w-24 shrink-0 text-muted-strong">Fastest lap</dt>
                        <dd>
                          <Crew e={r.fastestLap.entry} season={e.season} compact /> {r.fastestLap.time && <span className="tnum text-muted-strong">{r.fastestLap.time}</span>}
                        </dd>
                      </div>
                    )}
                  </dl>
                )}
                {r.note && <p className="mt-3 rounded-lg bg-surface-2 px-3 py-2 text-sm text-body">{r.note}</p>}
              </section>
            ))}
          </div>
        ) : (
          <EmptyState title="This result isn't in the archive yet">The race is on the calendar, but its classification hasn't been imported and verified. The assistant will say so rather than guess.</EmptyState>
        )}
        <AskPrompts className="mt-6" prompts={[`Tell me about the ${title}`]} />
      </Section>

      <nav aria-label="Race navigation" className="mt-12 flex items-center justify-between gap-3 border-y border-line py-3 text-sm">
        {prev ? (
          <Link href={href.event(prev.id)} className="inline-flex items-center gap-1.5 text-body hover:text-ink">
            <ArrowLeft className="size-4" strokeWidth={1.5} aria-hidden /> {prev.name}
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link href={href.event(next.id)} className="inline-flex items-center gap-1.5 text-body hover:text-ink">
            {next.name} <ArrowRight className="size-4" strokeWidth={1.5} aria-hidden />
          </Link>
        )}
      </nav>

      <SourcesSection ids={e.sources} page={href.event(e.id)} />
    </Container>
  );
}
