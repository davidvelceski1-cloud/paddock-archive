import { wallpaperPhotos } from "@/lib/archive/data";

export const dynamic = "force-static";

/** Photo sets for the fixed site backdrop, one per section of the site. */
export async function GET() {
  return Response.json({
    default: wallpaperPhotos(["wallpaper:", "entry:"], 30),
    seasons: wallpaperPhotos(["wallpaper:", "entry:"], 30),
    tracks: wallpaperPhotos(["track:", "wallpaper:"], 30),
    cars: wallpaperPhotos(["car:", "entry:"], 30),
    teams: wallpaperPhotos(["team:", "entry:"], 30),
    drivers: wallpaperPhotos(["entry:", "wallpaper:"], 30),
  });
}
