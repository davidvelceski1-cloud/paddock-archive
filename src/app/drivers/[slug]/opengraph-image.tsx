import { ix } from "@/lib/archive/data";
import { driverStats } from "@/lib/archive/stats";
import { OG_SIZE, ogCard } from "@/lib/og";
import { countryName } from "@/data/countries";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Driver profile on Paddock Archive";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const d = ix().drivers.get((await params).slug);
  if (!d) return ogCard({ kicker: "Drivers", title: "Driver not found" });
  const s = driverStats(d.id);
  return ogCard({
    kicker: "Driver",
    title: d.name,
    subtitle: countryName(d.nationality),
    stats: [
      ["World titles", String(s.titles.length)],
      ["Le Mans wins", String(s.leMansWins.length)],
      ["WEC seasons", String(s.seasons.length)],
    ],
  });
}
