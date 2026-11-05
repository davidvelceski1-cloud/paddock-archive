import { ix, seasonEndYear, teamDisplayName } from "@/lib/archive/data";
import { teamStats } from "@/lib/archive/stats";
import { OG_SIZE, ogCard } from "@/lib/og";
import { countryName } from "@/data/countries";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Team profile on Paddock Archive";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const t = ix().teams.get((await params).slug);
  if (!t) return ogCard({ kicker: "Teams", title: "Team not found" });
  const s = teamStats(t.id);
  return ogCard({
    kicker: t.status === "active" ? "Active team" : "Defunct team",
    title: teamDisplayName(t),
    subtitle: `${countryName(t.country)} · ${t.firstSeason}–${t.lastSeason ? seasonEndYear(t.lastSeason) : "today"}`,
    stats: [
      ["Seasons", String(s.seasons.length)],
      ["World titles", String(s.titles.length)],
      ["Le Mans wins", String(s.leMansWins.length)],
    ],
  });
}
