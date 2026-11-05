import type { Metadata } from "next";
import Link from "next/link";
import { Chip, Container, PageHeader, PlaceholderNotice, Section } from "@/components/ui/primitives";
import { ClassTag } from "@/components/archive/bits";
import { AskContext } from "@/components/ask/AskContext";
import { archive, href, ix } from "@/lib/archive/data";
import { carStats, manufacturerStats } from "@/lib/archive/stats";
import { countryName } from "@/data/countries";
import type { ClassFamily } from "@/data/schema";

export const metadata: Metadata = { title: "Cars & manufacturers", description: "The cars that defined endurance racing and the manufacturers behind them." };

const FAMILIES: { id: ClassFamily; label: string }[] = [
  { id: "hyper", label: "Hypercar" },
  { id: "lmp1", label: "LMP1" },
  { id: "lmp2", label: "LMP2" },
  { id: "gt", label: "GT" },
  { id: "hist", label: "Historic" },
];

export default async function CarsIndex({ searchParams }: { searchParams: Promise<{ family?: string }> }) {
  const { family } = await searchParams;
  const a = archive();
  const fam = FAMILIES.find((x) => x.id === family)?.id;
  const cars = a.cars.filter((c) => !fam || ix().classes.get(c.classId)?.family === fam).sort((x, y) => y.from - x.from || x.name.localeCompare(y.name));
  const makers = a.manufacturers
    .map((m) => ({ m, s: manufacturerStats(m.id) }))
    .sort((x, y) => y.s.leMansWins.length - x.s.leMansWins.length || x.m.name.localeCompare(y.m.name));

  return (
    <Container className="pt-12">
      <AskContext kind="other" suggestions={["Which car first won Le Mans as a hybrid?", "Which manufacturer has won Le Mans the most?", "What made the Nissan GT-R LM Nismo unusual?"]} />
      <PageHeader kicker={<PlaceholderNotice />} title="Cars & manufacturers">
        From the Bentley Speed Six to the Ferrari 499P — the machines, their powertrains and the companies that built them.
      </PageHeader>

      <Section title="Cars" id="cars" kicker={`${cars.length} profiled`}>
        <div className="no-scrollbar -mx-4 mb-5 flex gap-2 overflow-x-auto px-4" role="group" aria-label="Filter by class">
          <Chip href="/cars" active={!fam}>
            All classes
          </Chip>
          {FAMILIES.map((f) => (
            <Chip key={f.id} href={`/cars?family=${f.id}`} active={fam === f.id}>
              {f.label}
            </Chip>
          ))}
        </div>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cars.map((c) => {
            const s = carStats(c.id);
            return (
              <li key={c.id}>
                <Link href={href.car(c.id)} className="card card-link flex h-full flex-col p-5">
                  <span className="flex items-center justify-between gap-2">
                    <ClassTag id={c.classId} />
                    <span className="tnum text-xs text-muted-strong">
                      {c.from}
                      {c.to !== c.from && `–${c.to ?? ""}`}
                    </span>
                  </span>
                  <span className="mt-3 font-semibold tracking-tight text-ink">{c.name}</span>
                  <span className="mt-1 text-sm text-muted-strong">{ix().manufacturers.get(c.manufacturerId)?.name}</span>
                  <span className="mt-2 line-clamp-2 flex-1 text-sm text-body">{c.powertrain}</span>
                  {s.leMansWins.length > 0 && <span className="tnum mt-3 text-xs font-medium text-[var(--gt-ink)]">Le Mans winner · {s.leMansWins.join(", ")}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </Section>

      <Section title="Manufacturers" id="manufacturers" kicker="Ranked by Le Mans wins">
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {makers.map(({ m, s }) => (
            <li key={m.id}>
              <Link href={href.manufacturer(m.id)} className="card card-link flex items-center justify-between gap-3 p-4">
                <span className="min-w-0">
                  <span className="block truncate font-medium text-ink">{m.name}</span>
                  <span className="block text-xs text-muted-strong">{countryName(m.country)}</span>
                </span>
                <span className="tnum shrink-0 text-right">
                  <span className="block text-lg font-semibold text-ink">{s.leMansWins.length}</span>
                  <span className="block text-[10px] uppercase tracking-wider text-muted-strong">Le Mans</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>
    </Container>
  );
}
