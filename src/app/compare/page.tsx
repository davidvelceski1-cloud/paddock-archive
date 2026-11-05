import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { Chip, Container, EmptyState, PageHeader, PlaceholderNotice } from "@/components/ui/primitives";
import { ComparePicker } from "@/components/compare/ComparePicker";
import { CompareChart, type CompareDatum } from "@/components/compare/CompareChart";
import { AskContext, AskPrompts } from "@/components/ask/AskContext";
import { Ref, Refs } from "@/components/archive/bits";
import { archive, className, eventsForSeason, href, ix, leMansForSeason, resolveCar, resolveDriver, resolveManufacturer, resolveTeam, seasonEndYear, seasonLabel, teamDisplayName } from "@/lib/archive/data";
import { driverStats, teamStats } from "@/lib/archive/stats";
import { countryName } from "@/data/countries";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Compare", description: "Compare drivers, teams or seasons side by side." };

type Kind = "drivers" | "teams" | "seasons";
type Row = { label: string; values: (number | null)[]; note?: string } | { label: string; cells: ReactNode[] };
type Entity = { id: string; label: string; href: string };

const DEFAULTS: Record<Kind, string[]> = {
  drivers: ["tom-kristensen", "andre-lotterer"],
  teams: ["toyota-gazoo-racing", "porsche-lmp1-team"],
  seasons: ["2012", "2016"],
};

function build(kind: Kind, ids: string[]): { entities: Entity[]; rows: Row[] } {
  if (kind === "drivers") {
    const ds = ids.map((id) => ix().drivers.get(id)).filter((d) => !!d);
    const st = ds.map((d) => driverStats(d.id));
    return {
      entities: ds.map((d) => ({ id: d.id, label: d.name, href: href.driver(d.id) })),
      rows: [
        { label: "World titles", values: st.map((s) => s.titles.length) },
        { label: "Le Mans wins", values: st.map((s) => s.leMansWins.length) },
        { label: "WEC seasons", values: st.map((s) => s.seasons.length) },
        { label: "Wins", values: st.map((s) => s.wins.length), note: "loaded races" },
        { label: "Podiums", values: st.map((s) => s.podiums.length), note: "loaded races" },
        { label: "Nationality", cells: ds.map((d) => countryName(d.nationality)) },
        { label: "Teams", cells: st.map((s) => (s.teams.length ? <Refs items={s.teams.map((t) => resolveTeam(t))} /> : "—")) },
        { label: "Title years", cells: st.map((s) => s.titles.map(seasonLabel).join(", ") || "—") },
        { label: "Le Mans years", cells: st.map((s) => s.leMansWins.join(", ") || "—") },
      ],
    };
  }
  if (kind === "teams") {
    const ts = ids.map((id) => ix().teams.get(id)).filter((t) => !!t);
    const st = ts.map((t) => teamStats(t.id));
    return {
      entities: ts.map((t) => ({ id: t.id, label: teamDisplayName(t), href: href.team(t.id) })),
      rows: [
        { label: "Seasons", values: st.map((s) => s.seasons.length) },
        { label: "World titles", values: st.map((s) => s.titles.length) },
        { label: "Le Mans wins", values: st.map((s) => s.leMansWins.length) },
        { label: "Wins", values: st.map((s) => s.wins.length), note: "loaded races" },
        { label: "Podiums", values: st.map((s) => s.podiums.length), note: "loaded races" },
        { label: "Poles", values: st.map((s) => s.poles.length), note: "loaded races" },
        { label: "Status", cells: ts.map((t) => (t.status === "active" ? "Active" : `Defunct · ${t.lastSeason ? seasonEndYear(t.lastSeason) : ""}`)) },
        { label: "Country", cells: ts.map((t) => countryName(t.country)) },
        { label: "Cars", cells: st.map((s) => <Refs key="c" items={s.cars.map(resolveCar)} />) },
      ],
    };
  }
  const ss = ids
    .map((id) => ix().seasons.get(Number(id)))
    .filter((s) => !!s)
    .filter((s) => s.status !== "not-held");
  return {
    entities: ss.map((s) => ({ id: String(s.year), label: seasonLabel(s.year), href: href.season(s.year) })),
    rows: [
      { label: "Rounds", values: ss.map((s) => s.rounds ?? null) },
      { label: "Classes", values: ss.map((s) => s.classes.length) },
      { label: "Teams in archive", values: ss.map((s) => new Set(archive().teamEntries.filter((e) => e.season === s.year).map((e) => e.teamId)).size) },
      { label: "Races with results", values: ss.map((s) => eventsForSeason(s.year).filter((e) => e.results.length).length) },
      { label: "Championship", cells: ss.map((s) => (s.championshipId ? ix().championships.get(s.championshipId)!.name : "Le Mans only")) },
      { label: "Champions", cells: ss.map((s) => (s.champions[0]?.drivers ? <Refs items={s.champions[0].drivers.map(resolveDriver)} /> : "—")) },
      { label: "Manufacturers' title", cells: ss.map((s) => (s.champions[0]?.manufacturer ? <Ref r={resolveManufacturer(s.champions[0].manufacturer)} /> : "—")) },
      { label: "Le Mans winner", cells: ss.map((s) => leMansForSeason(s.year).map((l) => `${l.year}: ${resolveCar(l.car).label}`).join("; ") || "—") },
      { label: "Top class", cells: ss.map((s) => (s.classes[0] ? className(s.classes[0]) : "—")) },
    ],
  };
}

export default async function ComparePage({ searchParams }: { searchParams: Promise<{ type?: string; ids?: string }> }) {
  const sp = await searchParams;
  const kind: Kind = sp.type === "teams" || sp.type === "seasons" ? sp.type : "drivers";
  const requested = sp.ids === undefined ? DEFAULTS[kind] : sp.ids.split(",").filter(Boolean).slice(0, 3);
  const { entities, rows } = build(kind, requested);
  const a = archive();
  const options =
    kind === "drivers"
      ? [...a.drivers].sort((x, y) => x.name.localeCompare(y.name)).map((d) => ({ value: d.id, label: d.name }))
      : kind === "teams"
        ? a.teams.map((t) => ({ value: t.id, label: teamDisplayName(t) })).sort((x, y) => x.label.localeCompare(y.label))
        : [...a.seasons].filter((s) => s.status !== "not-held").reverse().map((s) => ({ value: String(s.year), label: seasonLabel(s.year) }));
  const numeric = rows.filter((r): r is Extract<Row, { values: unknown }> => "values" in r);
  const chartData: CompareDatum[] = numeric.map((r) => ({ stat: r.label, ...Object.fromEntries(entities.map((e, i) => [e.id, r.values[i] ?? 0])) }));
  const pair = entities.length >= 2 ? `${entities[0].label} and ${entities[1].label}` : null;

  return (
    <Container className="pt-12">
      <AskContext kind="other" suggestions={pair ? [`Compare ${pair}`] : []} />
      <PageHeader kicker={<PlaceholderNotice />} title="Compare">
        Put two or three drivers, teams or seasons side by side. The URL updates as you choose, so any comparison can be shared.
      </PageHeader>

      <div className="mt-8 flex gap-2" role="group" aria-label="What to compare">
        {(["drivers", "teams", "seasons"] as Kind[]).map((k) => (
          <Chip key={k} href={`/compare?type=${k}`} active={kind === k}>
            {k[0].toUpperCase() + k.slice(1)}
          </Chip>
        ))}
      </div>

      <div className="mt-6">
        <ComparePicker type={kind} ids={entities.map((e) => e.id)} options={options} />
      </div>

      {entities.length < 2 ? (
        <div className="mt-8">
          <EmptyState title="Pick at least two to compare">Choose from the menus above.</EmptyState>
        </div>
      ) : (
        <>
          <div className="card mt-8 overflow-x-auto">
            <table className="data-table w-full min-w-[560px] table-fixed text-sm">
              <caption className="sr-only">Side-by-side comparison</caption>
              <thead>
                <tr className="border-b border-line">
                  <th scope="col" className="pin w-44 px-4 py-3 text-left text-xs font-medium text-muted-strong">
                    &nbsp;
                  </th>
                  {entities.map((e, i) => (
                    <th key={e.id} scope="col" className="px-4 py-3 text-left">
                      <Link href={e.href} className="inline-flex items-center gap-2 font-semibold text-ink hover:underline">
                        <span className="size-2.5 rounded-full" style={{ background: `var(--series-${i + 1})` }} aria-hidden />
                        {e.label}
                      </Link>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => {
                  const max = "values" in r ? Math.max(...r.values.map((v) => v ?? -1)) : null;
                  return (
                    <tr key={r.label} className="border-b border-line last:border-0">
                      <th scope="row" className="pin px-4 py-3 text-left font-normal text-muted-strong">
                        {r.label}
                        {"note" in r && r.note && <span className="block text-[11px]">{r.note}</span>}
                      </th>
                      {"values" in r
                        ? r.values.map((v, i) => (
                            <td key={i} className={cn("tnum px-4 py-3 text-lg", v !== null && v === max && max > 0 ? "font-semibold text-ink" : "text-body")}>
                              {v ?? "—"}
                            </td>
                          ))
                        : r.cells.map((c, i) => (
                            <td key={i} className="px-4 py-3 text-body">
                              {c}
                            </td>
                          ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-xs text-muted-strong">The highest value in each row is in bold. “Loaded races” counts only races whose results are in the archive.</p>

          <div className="mt-8">
            <CompareChart title={`${entities.map((e) => e.label).join(" vs ")}`} data={chartData} series={entities.map((e) => ({ key: e.id, label: e.label }))} />
          </div>
          {pair && <AskPrompts className="mt-6" prompts={[`Compare ${pair}`]} />}
        </>
      )}
    </Container>
  );
}
