import Link from "next/link";
import { Container } from "@/components/ui/primitives";
import { Mark } from "./SiteHeader";

const LINKS = [
  ["Explore", [["/seasons", "Seasons"], ["/teams", "Teams"], ["/drivers", "Drivers"], ["/cars", "Cars & manufacturers"], ["/le-mans", "Le Mans winners"]]],
  ["Tools", [["/compare", "Compare"], ["/ask", "Ask the Archive"], ["/corrections", "Report a correction"]]],
] as const;

export function SiteFooter() {
  return (
    <footer className="mt-28 bg-surface-2 text-[12px] leading-relaxed">
      <Container className="grid max-w-[1024px] gap-8 border-t border-line py-10 sm:grid-cols-[1.5fr_1fr_1fr]">
        <div>
          <p className="flex items-center gap-1.5 font-semibold text-ink">
            <Mark className="size-4" /> Paddock Archive
          </p>
          <p className="mt-3 max-w-sm text-muted-strong">
            An independent archive of world-championship endurance racing. Not affiliated with the FIA, the ACO, the WEC or any manufacturer; names are used for identification only.
          </p>
          <p className="mt-3 max-w-sm text-muted-strong">Records are placeholder seed data pending verification. Every page lists its sources.</p>
        </div>
        {LINKS.map(([title, links]) => (
          <nav key={title} aria-label={title}>
            <p className="font-semibold text-ink">{title}</p>
            <ul className="mt-2 space-y-1.5">
              {links.map(([href, label]) => (
                <li key={href}>
                  <Link href={href} className="text-muted-strong hover:text-ink hover:underline">
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
