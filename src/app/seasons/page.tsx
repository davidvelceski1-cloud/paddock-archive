import type { Metadata } from "next";
import Link from "next/link";
import { Chip, Container, PageHeader, PlaceholderNotice } from "@/components/ui/primitives";
import { ClassTag } from "@/components/archive/bits";
import { AskContext, AskPrompts } from "@/components/ask/AskContext";
import { archive, href, ix, leMansForSeason, resolveCar, resolveDriver, seasonLabel } from "@/lib/archive/data";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Seasons", description: "Every season of world-championship endurance racing, from the first Le Mans in 1923 to the current FIA WEC season." };

type SP = Promise<{ era?: string; championship?: string }>;

export default async function SeasonsIndex({ searchParams }: { searchParams: SP }) {
  const { era, championship } = await searchParams;
  const a = archive();
  const eraSel = era && ix().eras.has(era) ? era : undefined;
  const champSel = championship === "none" || (championship && ix().championships.has(championship)) ? championship : undefined;
  const seasons = [...a.seasons]
    .filter((s) => (!eraSel || s.eraSlug === eraSel) && (!champSel || (champSel === "none" ? s.championshipId === null : s.championshipId === champSel)))
    .sort((x, y) => y.year - x.year);
  const eras = [...a.eras].reverse().filter((e) => seasons.some((s) => s.eraSlug === e.slug));
  const q = (p: Record<string, string | undefined>) => {
    const sp = new URLSearchParams(Object.entries({ era: eraSel, championship: champSel, ...p }).filter(([, v]) => v) as [string, string][]);
    return `/seasons${sp.size ? `?${sp}` : ""}`;
  };
  const current = eraSel ? ix().eras.get(eraSel) : undefined;

  return (
    <Container className="pt-12">
      <AskContext kind="other" suggestions={["What changed when the Hypercar class arrived?", "Which seasons did Porsche win the title?", "What was the Intercontinental Le Mans Cup?"]} />
      <PageHeader kicker={<PlaceholderNotice />} title={current ? current.name : "Seasons"}>
        {current ? current.summary : "Every year from the first 24 Hours of Le Mans to the current world championship. Featured seasons carry full race calendars; earlier years list the Le Mans winner."}
      </PageHeader>

      <div className="mt-8 space-y-3">
        <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4" role="group" aria-label="Filter by era">
          <Chip href={q({ era: undefined })} active={!eraSel}>
            All eras
          </Chip>
          {a.eras.map((e) => (
            <Chip key={e.slug} href={q({ era: e.slug })} active={eraSel === e.slug}>
              {e.name}
            </Chip>
          ))}
        </div>
        <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4" role="group" aria-label="Filter by championship">
          <Chip href={q({ championship: undefined })} active={!champSel}>
            Any championship
          </Chip>
          {a.championships.map((c) => (
            <Chip key={c.id} href={q({ championship: c.id })} active={champSel === c.id}>
              {c.name}
            </Chip>
          ))}
          <Chip href={q({ championship: "none" })} active={champSel === "none"}>
            Le Mans only
          </Chip>
        </div>
      </div>

      {current && <AskPrompts className="mt-6" prompts={[`What defined the ${current.name}?`, `Who won Le Mans during the ${current.name}?`]} />}

      {eras.map((e) => {
        const rows = seasons.filter((s) => s.eraSlug === e.slug);
        return (
          <section key={e.slug} className="mt-12" aria-labelledby={`era-${e.slug}`}>
            <div className="mb-4 flex items-baseline justify-between gap-3 border-b border-line pb-2">
              <h2 id={`era-${e.slug}`} className="text-lg font-semibold tracking-tight">
                {e.name}
              </h2>
              <span className="tnum text-sm text-muted-strong">{e.short}</span>
            </div>
            <ol className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {rows.map((s) => {
                if (s.status === "not-held")
                  return (
                    <li key={s.year} className="rounded-xl border border-dashed border-line px-4 py-3">
                      <p className="tnum font-semibold text-muted-strong">{s.year}</p>
                      <p className="text-xs text-muted-strong">Not held</p>
                    </li>
                  );
                const top = s.champions[0];
                const lm = leMansForSeason(s.year).at(-1);
                const line = top?.drivers ? top.drivers.map((d) => resolveDriver(d).label.split(" ").at(-1)).join(" / ") : lm ? resolveCar(lm.car).label : "—";
                const hasCalendar = a.events.some((ev) => ev.season === s.year);
                return (
                  <li key={s.year}>
                    <Link href={href.season(s.year)} className="card card-link block h-full px-4 py-3">
                      <span className="flex items-center justify-between gap-2">
                        <span className="tnum text-lg font-semibold tracking-tight text-ink">{seasonLabel(s.year)}</span>
                        {s.status === "in-progress" ? (
                          <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">Live</span>
                        ) : (
                          s.classes[0] && s.year >= 2010 && <ClassTag id={s.classes[0]} />
                        )}
                      </span>
                      <span className="mt-1 block truncate text-sm text-body">{line}</span>
                      <span className={cn("mt-1 block text-xs", hasCalendar ? "text-accent-ink" : "text-muted-strong")}>
                        {hasCalendar ? "Full calendar" : top ? "Champions" : s.status === "in-progress" ? "Results pending" : "Le Mans winner"}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ol>
          </section>
        );
      })}
      {!seasons.length && <p className="mt-10 text-body">No seasons match these filters.</p>}
    </Container>
  );
}
