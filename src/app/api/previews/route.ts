import { allPreviews } from "@/lib/archive/previews";

export const dynamic = "force-static";

/** Hover-card data for every driver, car, team, season, race and track page, keyed by path. */
export async function GET() {
  return Response.json(allPreviews());
}
