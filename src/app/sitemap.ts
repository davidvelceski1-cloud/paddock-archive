import type { MetadataRoute } from "next";
import { archive, href } from "@/lib/archive/data";
import { SITE_URL } from "@/lib/utils";

export default function sitemap(): MetadataRoute.Sitemap {
  const a = archive();
  const paths = [
    "/",
    "/seasons",
    "/teams",
    "/drivers",
    "/cars",
    "/compare",
    "/le-mans",
    "/ask",
    ...a.seasons.filter((s) => s.status !== "not-held").map((s) => href.season(s.year)),
    ...a.events.map((e) => href.event(e.id)),
    ...a.teams.map((t) => href.team(t.id)),
    ...a.drivers.map((d) => href.driver(d.id)),
    ...a.cars.map((c) => href.car(c.id)),
    ...a.manufacturers.map((m) => href.manufacturer(m.id)),
    ...a.stories.map((s) => href.story(s.slug)),
  ];
  return paths.map((p) => ({ url: `${SITE_URL}${p}` }));
}
