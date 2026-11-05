import { ix, leMansForSeason, resolveCar, seasonLabel } from "@/lib/archive/data";
import { OG_SIZE, ogCard } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Season on Paddock Archive";

export default async function Image({ params }: { params: Promise<{ year: string }> }) {
  const y = Number((await params).year);
  const s = ix().seasons.get(y);
  if (!s) return ogCard({ kicker: "Seasons", title: "Season not found" });
  const champ = s.championshipId ? ix().championships.get(s.championshipId)?.name : "24 Hours of Le Mans";
  const lm = leMansForSeason(y).at(-1);
  return ogCard({
    kicker: "Season",
    title: seasonLabel(y),
    subtitle: champ,
    stats: [...(s.rounds ? [["Rounds", String(s.rounds)] as [string, string]] : []), ...(lm ? [["Le Mans winner", resolveCar(lm.car).label] as [string, string]] : [])],
  });
}
