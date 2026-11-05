import Link from "next/link";
import { ArrowRight, CalendarDays } from "lucide-react";
import { Container, PlaceholderNotice, Section } from "@/components/ui/primitives";
import { HeroSearch } from "@/components/home/HeroSearch";
import { AskContext } from "@/components/ask/AskContext";
import { archive, href, ix } from "@/lib/archive/data";
import { quickStats } from "@/lib/archive/stats";
import { onThisDay } from "@/lib/archive/onthisday";
import { fmtDate, fmtNum } from "@/lib/utils";

export const revalidate = 3600;

const ERA_TONE: Record<string, string> = {
  "pre-war": "var(--hist-bar)",
  "world-sportscar": "var(--hist-bar)",
  "group-c": "var(--lmp1-bar)",
  "gt-era": "var(--gt-bar)",
  ilmc: "var(--lmp2-bar)",
  "lmp1-hybrid": "var(--lmp1-bar)",
  hypercar: "var(--hyper-bar)",
};

export default function Home() {
  const a = archive();
  const stats = quickStats();
  const day = onThisDay();

  return (
    <>
      <AskContext kind="home" suggestions={[]} />
      <section className="hero-glow relative overflow-hidden border-b border-line/60">
        <Container className="pb-16 pt-16 text-center sm:pb-20 sm:pt-24">
          <p className="rise mb-5 inline-flex items-center gap-2 rounded-full border border-line bg-surface/80 px-3 py-1 text-xs text-body backdrop-blur">
            <span className="size-1.5 rounded-full bg-[var(--accent-3)]" aria-hidden />
            Le Mans 1923 → the Hypercar era
          </p>
          <h1 className="display rise mx-auto max-w-3xl text-5xl sm:text-7xl">
            Every lap of <span className="text-gradient">endurance</span> history.
          </h1>
          <p className="rise mx-auto mt-5 max-w-xl text-lg text-body">Seasons, teams, drivers and cars of world-championship endurance racing — linked, sourced, and searchable in plain language.</p>
          <div className="rise mt-9">
            <HeroSearch />
          </div>
        </Container>
      </section>

      <Container>
        {/* Quick stats */}
        <ul aria-label="Archive at a glance" className="-mt-px grid grid-cols-2 gap-px overflow-hidden rounded-b-2xl border-x border-b border-line bg-line sm:grid-cols-4">
          {(
            [
              ["Seasons covered", stats.seasons, "/seasons"],
              ["Teams", stats.teams, "/teams"],
              ["Drivers", stats.drivers, "/drivers"],
              ["Races", stats.races, "/le-mans"],
            ] as const
          ).map(([label, value, to]) => (
            <li key={label} className="bg-surface">
              <Link href={to} className="block h-full px-5 py-5 transition-colors hover:bg-surface-2">
                <span className="tnum block text-3xl font-semibold tracking-tight text-ink">{fmtNum(value)}</span>
                <span className="mt-1 block text-sm text-body">{label}</span>
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-3 flex justify-center">
          <PlaceholderNotice />
        </div>

        {/* Eras */}
        <Section title="Travel through the eras" kicker="Timeline" id="eras" action={<Link href="/seasons" className="inline-flex items-center gap-1 text-sm text-body hover:text-ink">All seasons <ArrowRight className="size-3.5" strokeWidth={1.5} aria-hidden /></Link>}>
          <ol className="no-scrollbar -mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-3 sm:mx-0 sm:px-0">
            {a.eras.map((e, i) => (
              <li key={e.slug} className="w-64 shrink-0 snap-start">
                <Link href={href.era(e.slug)} className="card card-link flex h-full flex-col p-4">
                  <span className="flex items-center gap-2">
                    <span className="h-1.5 w-8 rounded-full" style={{ background: ERA_TONE[e.slug] }} aria-hidden />
                    <span className="tnum text-xs text-muted-strong">
                      {String(i + 1).padStart(2, "0")} · {e.short}
                    </span>
                  </span>
                  <span className="mt-3 font-semibold tracking-tight text-ink">{e.name}</span>
                  <span className="mt-1.5 line-clamp-3 text-sm text-body">{e.summary}</span>
                </Link>
              </li>
            ))}
          </ol>
        </Section>

        <div className="mt-14 grid gap-6 lg:grid-cols-[1fr_2fr]">
          {/* On this day */}
          <section aria-labelledby="otd-h" className="card relative overflow-hidden p-6">
            <div className="hero-glow pointer-events-none absolute inset-0 opacity-70" aria-hidden />
            <div className="relative">
              <h2 id="otd-h" className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.12em] text-muted-strong">
                <CalendarDays className="size-4" strokeWidth={1.5} aria-hidden />
                {day.exact ? "On this day in endurance racing" : "Coming up in endurance history"}
              </h2>
              {day.items.length ? (
                <ul className="mt-4 space-y-4">
                  {day.items.slice(0, 3).map((it) => (
                    <li key={it.href + it.date}>
                      <p className="tnum text-sm text-muted-strong">{fmtDate(it.date, { day: "numeric", month: "long", year: "numeric" })}</p>
                      <Link href={it.href} className="mt-0.5 block text-lg font-semibold tracking-tight text-ink hover:underline">
                        {it.title}
                      </Link>
                      <p className="mt-1 text-sm text-body">{it.detail}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-4 text-body">
                  No dated races loaded yet.
                </p>
              )}
            </div>
          </section>

          {/* Featured stories */}
          <section aria-labelledby="stories-h">
            <h2 id="stories-h" className="sr-only">
              Featured stories
            </h2>
            <ul className="grid h-full gap-4 sm:grid-cols-3">
              {a.stories.map((s) => {
                const era = s.eraSlug ? ix().eras.get(s.eraSlug) : undefined;
                return (
                  <li key={s.slug}>
                    <Link href={href.story(s.slug)} className="card card-link flex h-full flex-col p-5">
                      <span className="text-xs font-medium uppercase tracking-[0.12em] text-muted-strong">{era?.name ?? "Story"}</span>
                      <span className="mt-3 text-lg font-semibold leading-snug tracking-tight text-ink">{s.title}</span>
                      <span className="mt-2 flex-1 text-sm text-body">{s.dek}</span>
                      <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-accent-ink">
                        Read story <ArrowRight className="size-3.5" strokeWidth={1.5} aria-hidden />
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        </div>

        <Section title="Start exploring" kicker="Browse" id="browse">
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["/seasons", "Seasons", "Year by year, from 1923 to today, with calendars and champions."],
              ["/teams", "Teams", "Works teams and privateers — active and long gone."],
              ["/drivers", "Drivers", "Career timelines across teams, classes and decades."],
              ["/cars", "Cars & manufacturers", "From the Bentley Boys to the Ferrari 499P."],
            ].map(([to, title, body]) => (
              <li key={to}>
                <Link href={to} className="card card-link block h-full p-5">
                  <span className="font-semibold tracking-tight text-ink">{title}</span>
                  <span className="mt-1.5 block text-sm text-body">{body}</span>
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      </Container>
    </>
  );
}
