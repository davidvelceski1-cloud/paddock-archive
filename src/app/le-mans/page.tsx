import type { Metadata } from "next";
import Link from "next/link";
import { Container, PageHeader, PlaceholderNotice } from "@/components/ui/primitives";
import { Ref, SourcesSection } from "@/components/archive/bits";
import { AskContext, AskPrompts } from "@/components/ask/AskContext";
import { archive, href, ix, resolveCar, resolveDriver, resolveManufacturer, resolveTeam, seasonOfLeMans } from "@/lib/archive/data";
import { LE_MANS_NOT_HELD } from "@/data/seed/lemans";

export const metadata: Metadata = { title: "Le Mans winners", description: "Every overall winner of the 24 Hours of Le Mans since 1923." };

export default function LeMansPage() {
  const a = archive();
  const rows = [...a.leMans.map((l) => ({ year: l.year, l })), ...LE_MANS_NOT_HELD.map((year) => ({ year, l: undefined }))].sort((x, y) => y.year - x.year);
  const decades = [...new Set(rows.map((r) => Math.floor(r.year / 10) * 10))];
  const byMaker = new Map<string, number>();
  for (const l of a.leMans) byMaker.set(l.manufacturer, (byMaker.get(l.manufacturer) ?? 0) + 1);
  const top = [...byMaker.entries()].sort((x, y) => y[1] - x[1]).slice(0, 6);

  return (
    <Container className="pt-12">
      <AskContext kind="other" suggestions={["Who has won Le Mans the most times?", "Which manufacturers won Le Mans in the 1980s?", "When did a hybrid first win Le Mans?"]} />
      <PageHeader kicker={<PlaceholderNotice />} title="Le Mans winners">
        Every overall winner of the 24 Hours since the first race in May 1923. The race was not held in 1936 or between 1940 and 1948.
      </PageHeader>

      <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6" aria-label="Most Le Mans wins by manufacturer">
        {top.map(([m, n]) => (
          <li key={m} className="card p-4">
            <p className="tnum text-2xl font-semibold text-ink">{n}</p>
            <p className="text-sm">
              <Ref r={resolveManufacturer(m)} />
            </p>
          </li>
        ))}
      </ul>

      <AskPrompts className="mt-6" prompts={["Who has won Le Mans the most times?", "Which cars won Le Mans three years in a row?"]} />

      <nav aria-label="Jump to decade" className="no-scrollbar sticky top-14 z-10 -mx-4 mt-8 flex gap-1 overflow-x-auto border-b border-line bg-bg/90 px-4 py-2 backdrop-blur">
        {decades.map((d) => (
          <a key={d} href={`#d${d}`} className="tnum shrink-0 rounded-md px-2 py-1 text-sm text-body hover:bg-surface-2 hover:text-ink">
            {d}s
          </a>
        ))}
      </nav>

      {decades.map((d) => (
        <section key={d} id={`d${d}`} className="mt-8 scroll-mt-28" aria-label={`${d}s`}>
          <h2 className="mb-3 text-sm font-semibold text-muted-strong">{d}s</h2>
          <div className="card overflow-x-auto">
            <table className="data-table w-full min-w-[640px] text-sm">
              <caption className="sr-only">Le Mans winners in the {d}s</caption>
              <thead>
                <tr className="border-b border-line text-left text-xs text-muted-strong">
                  <th scope="col" className="pin w-20 px-4 py-2.5 font-medium">
                    Year
                  </th>
                  <th scope="col" className="px-4 py-2.5 font-medium">
                    Car
                  </th>
                  <th scope="col" className="px-4 py-2.5 font-medium">
                    Drivers
                  </th>
                  <th scope="col" className="px-4 py-2.5 font-medium">
                    Entrant
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows
                  .filter((r) => Math.floor(r.year / 10) * 10 === d)
                  .map(({ year, l }) => {
                    const key = seasonOfLeMans(year);
                    const ev = key ? a.events.find((e) => e.season === key && e.id.endsWith("le-mans")) : undefined;
                    return (
                      <tr key={year} className="border-b border-line last:border-0">
                        <td className="pin tnum px-4 py-3 font-medium text-ink">{ev ? <Link href={href.event(ev.id)}>{year}</Link> : key && ix().seasons.has(key) ? <Link href={href.season(key)}>{year}</Link> : year}</td>
                        {l ? (
                          <>
                            <td className="px-4 py-3">
                              <Ref r={resolveCar(l.car)} />
                              <span className="block text-xs text-muted-strong">{resolveManufacturer(l.manufacturer).label}</span>
                            </td>
                            <td className="px-4 py-3 text-body">
                              {l.drivers.map((x, i) => (
                                <span key={x}>
                                  {i > 0 && ", "}
                                  <Ref r={resolveDriver(x)} className={resolveDriver(x).href ? "" : "text-body"} />
                                </span>
                              ))}
                            </td>
                            <td className="px-4 py-3 text-body">{l.team ? <Ref r={resolveTeam(l.team, key)} className="text-body" /> : <span className="text-muted">—</span>}</td>
                          </>
                        ) : (
                          <td colSpan={3} className="px-4 py-3 text-muted-strong">
                            Not held
                          </td>
                        )}
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </section>
      ))}
      <SourcesSection ids={["seed-editorial", "aco-lemans"]} page="/le-mans" />
    </Container>
  );
}
