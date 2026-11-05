import Link from "next/link";
import { Container } from "@/components/ui/primitives";
import { Mark } from "./SiteHeader";

const LINKS = [
  ["Explore", [["/seasons", "Seasons"], ["/teams", "Teams"], ["/drivers", "Drivers"], ["/cars", "Cars & manufacturers"], ["/le-mans", "Le Mans winners"]]],
  ["Tools", [["/compare", "Compare"], ["/ask", "Ask the Archive"], ["/corrections", "Report a correction"]]],
] as const;

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-line">
      <Container className="grid gap-10 py-12 sm:grid-cols-[1.5fr_1fr_1fr]">
        <div>
          <p className="flex items-center gap-2 font-semibold text-ink">
            <Mark className="size-5" /> Paddock Archive
          </p>
          <p className="mt-3 max-w-sm text-sm text-body">
            An independent archive of world-championship endurance racing. Not affiliated with the FIA, the ACO, the WEC or any manufacturer; names are used for identification only.
          </p>
          <p className="mt-3 max-w-sm text-xs text-muted-strong">Records are placeholder seed data pending verification. Every page lists its sources.</p>
        </div>
        {LINKS.map(([title, links]) => (
          <nav key={title} aria-label={title}>
            <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-strong">{title}</p>
            <ul className="mt-3 space-y-2 text-sm">
              {links.map(([href, label]) => (
                <li key={href}>
                  <Link href={href} className="text-body hover:text-ink">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </Container>
    </footer>
  );
}
