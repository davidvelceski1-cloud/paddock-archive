"use client";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Wallpaper, type WallpaperPhoto } from "@/components/home/Wallpaper";

type Sets = Record<"default" | "seasons" | "tracks" | "cars" | "teams" | "drivers", WallpaperPhoto[]>;

let cache: Promise<Sets | null> | null = null;
const load = () => (cache ??= fetch("/api/wallpapers").then((r) => (r.ok ? (r.json() as Promise<Sets>) : null)).catch(() => null));

const sectionOf = (path: string): keyof Sets => {
  const first = path.split("/")[1];
  if (first === "tracks" || first === "cars" || first === "teams" || first === "drivers") return first;
  if (first === "seasons" || first === "le-mans") return "seasons";
  return "default";
};

/**
 * A fixed, full-screen photo slideshow behind every page: it stays put while the page
 * scrolls over it and keeps changing. Each section of the site has its own photo set
 * (track photos on Tracks, cars on Cars…). A tint in the page colour keeps text readable.
 */
export function SiteBackdrop() {
  const path = usePathname();
  const [sets, setSets] = useState<Sets | null>(null);
  useEffect(() => {
    load().then(setSets);
  }, []);
  const photos = sets?.[sectionOf(path)] ?? [];
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 bg-bg" aria-hidden>
      {photos.length > 0 && <Wallpaper key={sectionOf(path)} photos={photos} className="absolute inset-0" randomStart creditClassName="left-3 right-auto bottom-2 z-[3] text-[10px] text-ink/60" />}
      <div className="site-backdrop-tint absolute inset-0 z-[2]" />
    </div>
  );
}
