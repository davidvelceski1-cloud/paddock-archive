import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Container, EmptyState, PageHeader, PlaceholderNotice } from "@/components/ui/primitives";
import { NLFilterBar } from "@/components/filters/NLFilterBar";
import { FilterChips } from "@/components/filters/FilterChips";
import { Facets, Pager, paginate } from "@/components/filters/Facets";
import { NameSearch } from "@/components/filters/NameSearch";
import { AskContext } from "@/components/ask/AskContext";
import { archive, href, resolveTeam } from "@/lib/archive/data";
import { driverStats } from "@/lib/archive/stats";
import { applyDrivers, fromParams } from "@/lib/search/filters";
import { countryName } from "@/data/countries";
import { norm } from "@/lib/search/fuzzy";

export const metadata: Metadata = { title: "Drivers", description: "Every driver in the archive with career timelines across teams, classes and decades." };

type SP = Promise<Record<string, string | string[] | undefined>>;

const surname = (name: string) => name.split(" ").at(-1)!;

export default async function DriversIndex({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const f = fromParams(sp);
  const a = archive();
  const filtered = applyDrivers(f).sort((x, y) => norm(surname(x.name)).localeCompare(norm(surname(y.name))));
  const { page, pages, rows } = paginate(filtered, sp.page, 90);
  const groups = new Map<string, typeof rows>();
  for (const d of rows) {
    const L = norm(surname(d.name))[0].toUpperCase();
    groups.set(L, [...(groups.get(L) ?? []), d]);
  }
  const nationalities = [...new Set(a.drivers.map((d) => d.nationality))].sort((x, y) => countryName(x).localeCompare(countryName(y)));

  return (
    <Container className="pt-12">
      <AskContext kind="other" suggestions={["Who has won Le Mans the most times?", "Which drivers raced for both Audi and Porsche?", "Who were Toyota's world champions?"]} />
      <PageHeader kicker={<PlaceholderNotice />} title="Drivers">
        From the Bentley Boys to today&apos;s Hypercar crews: career timelines, titles, Le Mans wins and teammates.
      </PageHeader>

      <div className="mt-8 grid gap-4 lg:grid-cols-[1fr_1.4fr]">
        <Suspense>
          <NameSearch placeholder="Search drivers by name…" />
        </Suspense>
        <NLFilterBar scope="drivers" examples={["Le Mans winners from Britain", "Active Japanese drivers", "Drivers who drove for Audi", "World champions in the Hypercar era"]} />
      </div>

      <div className="card mt-6 p-4">
        <Facets
          basePath="/drivers"
          filters={f}
          facets={[
            { label: "Status", key: "status", options: [{ value: undefined, label: "All" }, { value: "active", label: "Active" }, { value: "retired", label: "Not racing in WEC" }] },
            { label: "Era", key: "era", options: [{ value: undefined, label: "Any" }, ...a.eras.map((e) => ({ value: e.slug, label: e.name }))] },
            {
              label: "Class",
              key: "class",
              options: [{ value: undefined, label: "Any" }, ...[...new Set(a.driverEntries.map((e) => e.classId))].map((c) => ({ value: c, label: a.classes.find((x) => x.id === c)?.name ?? c }))],
            },
            { label: "Nationality", key: "country", options: [{ value: undefined, label: "Any" }, ...nationalities.map((c) => ({ value: c, label: countryName(c) }))] },
            { label: "Honours", key: "lemans", options: [{ value: undefined, label: "Any" }, { value: true, label: "Le Mans winners" }] },
          ]}
        />
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <FilterChips filters={f} scope="drivers" basePath="/drivers" count={filtered.length} total={a.drivers.length} />
        <nav aria-label="Jump to letter" className="no-scrollbar flex gap-0.5 overflow-x-auto text-xs">
          {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((L) =>
            groups.has(L) ? (
              <a key={L} href={`#letter-${L}`} className="rounded px-1.5 py-1 font-medium text-ink hover:bg-surface-2">
                {L}
              </a>
            ) : (
              <span key={L} className="px-1.5 py-1 text-muted" aria-hidden>
                {L}
              </span>
            ),
          )}
        </nav>
      </div>

      {rows.length ? (
        [...groups.entries()].map(([L, ds]) => (
          <section key={L} id={`letter-${L}`} className="mt-8 scroll-mt-20" aria-label={`Drivers, ${L}`}>
            <h2 className="mb-3 border-b border-line pb-1 text-sm font-semibold text-muted-strong">{L}</h2>
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {ds.map((d) => {
                const s = driverStats(d.id);
                const lastTeam = s.entries.at(-1);
                return (
                  <li key={d.id}>
                    <Link href={href.driver(d.id)} className="card card-link flex h-full items-start justify-between gap-3 p-4">
                      <span className="min-w-0">
                        <span className="block truncate font-medium text-ink">{d.name}</span>
                        <span className="block truncate text-sm text-muted-strong">
                          {countryName(d.nationality)}
                          {lastTeam ? ` · ${resolveTeam(lastTeam.team, lastTeam.season).label}` : ""}
                        </span>
                      </span>
                      <span className="tnum shrink-0 text-right text-xs text-muted-strong">
                        {s.leMansWins.length > 0 && <span className="block font-medium text-ink">{s.leMansWins.length}× Le Mans</span>}
                        {s.titles.length > 0 && <span className="block">{s.titles.length}× champion</span>}
                        {d.status === "active" && <span className="mt-0.5 inline-block rounded-full bg-emerald-50 px-1.5 text-[10px] font-medium text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">Active</span>}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        ))
      ) : (
        <div className="mt-6">
          <EmptyState title="No drivers match">Try removing a filter chip or searching a different spelling.</EmptyState>
        </div>
      )}
      <Pager page={page} pages={pages} filters={f} basePath="/drivers" />
    </Container>
  );
}
