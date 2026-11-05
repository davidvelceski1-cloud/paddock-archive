import type { Metadata } from "next";
import Link from "next/link";
import { Container, EmptyState, PageHeader, PlaceholderNotice, StatusBadge } from "@/components/ui/primitives";
import { ClassTag } from "@/components/archive/bits";
import { NLFilterBar } from "@/components/filters/NLFilterBar";
import { FilterChips } from "@/components/filters/FilterChips";
import { Facets, Pager, SortLinks, paginate } from "@/components/filters/Facets";
import { AskContext } from "@/components/ask/AskContext";
import { archive, href, ix, seasonEndYear, teamDisplayName } from "@/lib/archive/data";
import { teamClasses, teamStats } from "@/lib/archive/stats";
import { applyTeams, fromParams } from "@/lib/search/filters";
import { countryName } from "@/data/countries";

export const metadata: Metadata = { title: "Teams", description: "Every team in the archive — active works squads and defunct privateers — with career timelines, results and the story of why they left." };

type SP = Promise<Record<string, string | string[] | undefined>>;

const SORTS = [
  { value: "name", label: "Name" },
  { value: "first", label: "First season" },
  { value: "titles", label: "Titles" },
  { value: "lemans", label: "Le Mans wins" },
  { value: "wins", label: "Wins" },
];

export default async function TeamsIndex({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const f = fromParams(sp);
  const a = archive();
  const filtered = applyTeams(f);
  const withStats = filtered.map((t) => ({ t, s: teamStats(t.id) }));
  const sort = f.sort ?? "name";
  withStats.sort((x, y) => {
    if (sort === "first") return x.t.firstSeason - y.t.firstSeason;
    if (sort === "titles") return y.s.titles.length - x.s.titles.length;
    if (sort === "lemans") return y.s.leMansWins.length - x.s.leMansWins.length;
    if (sort === "wins") return y.s.wins.length - x.s.wins.length;
    return teamDisplayName(x.t).localeCompare(teamDisplayName(y.t));
  });
  const { page, pages, rows } = paginate(withStats, sp.page);

  const classes = [...new Set(a.teamEntries.map((e) => e.classId))];
  const countries = [...new Set(a.teams.map((t) => t.country))].sort();
  const makers = [...new Set(a.teams.flatMap((t) => t.manufacturerIds))];
  const decades = [...new Set(a.teamEntries.map((e) => Math.floor(e.season / 10) * 10))].sort();

  return (
    <Container className="pt-12">
      <AskContext kind="other" suggestions={["Which teams left the WEC and why?", "Which teams won Le Mans in the LMP1 hybrid era?", "Compare Toyota and Porsche between 2014 and 2017"]} />
      <PageHeader kicker={<PlaceholderNotice />} title="Teams">
        Works teams and privateers, active and long gone — with their names over time, the cars they raced and the reasons they left.
      </PageHeader>

      <NLFilterBar scope="teams" className="mt-8 max-w-2xl" examples={["French teams that left before 2015", "Defunct LMP1 teams", "Active Hypercar teams", "Teams that won Le Mans"]} />

      <div className="mt-8 card p-4">
        <Facets
          basePath="/teams"
          filters={f}
          facets={[
            { label: "Status", key: "status", options: [{ value: undefined, label: "All" }, { value: "active", label: "Active" }, { value: "defunct", label: "Defunct" }] },
            { label: "Class", key: "class", options: [{ value: undefined, label: "Any" }, ...classes.map((c) => ({ value: c, label: ix().classes.get(c)?.name ?? c }))] },
            { label: "Country", key: "country", options: [{ value: undefined, label: "Any" }, ...countries.map((c) => ({ value: c, label: countryName(c) }))] },
            { label: "Maker", key: "manufacturer", options: [{ value: undefined, label: "Any" }, ...makers.map((m) => ({ value: m, label: ix().manufacturers.get(m)?.name ?? m }))] },
            { label: "Decade", key: "decade", options: [{ value: undefined, label: "Any" }, ...decades.map((d) => ({ value: d, label: `${d}s` }))] },
          ]}
        />
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <FilterChips filters={f} scope="teams" basePath="/teams" count={filtered.length} total={a.teams.length} />
        <SortLinks options={SORTS} filters={f} basePath="/teams" />
      </div>

      {rows.length ? (
        <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map(({ t, s }) => (
            <li key={t.id}>
              <Link href={href.team(t.id)} className="card card-link flex h-full flex-col p-5">
                <span className="flex items-start justify-between gap-3">
                  <span className="font-semibold tracking-tight text-ink">{teamDisplayName(t)}</span>
                  <StatusBadge status={t.status} until={t.lastSeason ? seasonEndYear(t.lastSeason) : null} />
                </span>
                <span className="tnum mt-1 text-sm text-muted-strong">
                  {countryName(t.country)} · {t.firstSeason}–{t.lastSeason ? seasonEndYear(t.lastSeason) : "today"}
                </span>
                {t.names.length > 1 && <span className="mt-1 text-xs text-muted-strong">Also raced as {t.names.slice(0, -1).map((n) => n.name).join(", ")}</span>}
                <span className="mt-3 line-clamp-2 flex-1 text-sm text-body">{t.tagline}</span>
                <span className="mt-4 flex flex-wrap gap-1.5">
                  {teamClasses(t.id).map((c) => (
                    <ClassTag key={c} id={c} />
                  ))}
                </span>
                <span className="tnum mt-4 grid grid-cols-3 gap-2 border-t border-line pt-3 text-center">
                  {[
                    ["Seasons", s.seasons.length],
                    ["Titles", s.titles.length],
                    ["Le Mans", s.leMansWins.length],
                  ].map(([l, v]) => (
                    <span key={l}>
                      <span className="block text-lg font-semibold text-ink">{v}</span>
                      <span className="block text-xs text-muted-strong">{l}</span>
                    </span>
                  ))}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-6">
          <EmptyState title="No teams match these filters">Try removing a filter chip, or describe what you're looking for in a different way.</EmptyState>
        </div>
      )}
      <Pager page={page} pages={pages} filters={f} basePath="/teams" />
    </Container>
  );
}
