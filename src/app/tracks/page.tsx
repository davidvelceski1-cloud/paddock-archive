/* eslint-disable @next/next/no-img-element -- Commons thumbnails, already sized */
import type { Metadata } from "next";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { Container, PlaceholderNotice } from "@/components/ui/primitives";
import { Wallpaper } from "@/components/home/Wallpaper";
import { archive, href, photoOf, racesAt, wallpaperPhotos } from "@/lib/archive/data";
import { countryName } from "@/data/countries";

export const metadata: Metadata = {
  title: "Tracks",
  description: "Every circuit in the archive, from the Circuit de la Sarthe to Fuji, Spa and Sebring: specs, layout changes and history.",
};

export default function TracksPage() {
  const tracks = [...archive().tracks].sort((x, y) => x.opened - y.opened);
  return (
    <>
      <section className="relative isolate overflow-hidden bg-black">
        <Wallpaper photos={wallpaperPhotos(["track:"], 16)} className="absolute inset-0 -z-10" />
        <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-black/60 via-black/45 to-black/70" aria-hidden />
        <Container className="relative pb-16 pt-16 sm:pb-20 sm:pt-24">
          <p className="rise mb-3 text-[17px] font-semibold text-white/80">{tracks.length} circuits</p>
          <h1 className="display rise max-w-3xl text-5xl text-white sm:text-6xl">Tracks</h1>
          <p className="rise mt-4 max-w-2xl text-xl text-white/85">Where the races were run: the Circuit de la Sarthe since 1923 and every World Endurance Championship venue. Hover a track for its specs; open it for its history.</p>
        </Container>
      </section>

      <Container className="pt-8">
        <PlaceholderNotice />
        <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {tracks.map((t) => {
            const photo = photoOf(`track:${t.id}`) ?? photoOf(`trackmap:${t.id}`);
            const map = photoOf(`trackmap:${t.id}`);
            const { events, leMans } = racesAt(t.id);
            const races = events.length + leMans.length;
            return (
              <li key={t.id}>
                <Link href={href.track(t.id)} className="card card-link block h-full overflow-hidden">
                  <div className="relative aspect-[16/9] bg-surface-2">
                    {photo && <img src={photo.src} alt={photo.alt} loading="lazy" decoding="async" className="absolute inset-0 size-full object-cover" />}
                    {map && photo !== map && <img src={map.src} alt="" loading="lazy" className="absolute bottom-2 right-2 h-16 w-24 rounded-md bg-white/90 object-contain p-1 shadow" />}
                  </div>
                  <div className="p-5">
                    <p className="flex items-center gap-1 text-sm text-muted-strong">
                      <MapPin className="size-3.5" strokeWidth={1.5} aria-hidden />
                      {t.location}, {countryName(t.country)}
                    </p>
                    <p className="mt-1 text-lg font-semibold leading-snug text-ink">{t.name}</p>
                    <p className="mt-1 line-clamp-2 text-sm text-body">{t.tagline}</p>
                    <dl className="tnum mt-3 grid grid-cols-3 gap-2 text-center text-sm">
                      <div className="rounded-lg bg-surface-2 py-2">
                        <dt className="text-[11px] text-muted-strong">Length</dt>
                        <dd className="font-semibold text-ink">{t.lengthKm.toFixed(3)} km</dd>
                      </div>
                      <div className="rounded-lg bg-surface-2 py-2">
                        <dt className="text-[11px] text-muted-strong">Corners</dt>
                        <dd className="font-semibold text-ink">{t.turns}</dd>
                      </div>
                      <div className="rounded-lg bg-surface-2 py-2">
                        <dt className="text-[11px] text-muted-strong">Races here</dt>
                        <dd className="font-semibold text-ink">{races}</dd>
                      </div>
                    </dl>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </Container>
    </>
  );
}
