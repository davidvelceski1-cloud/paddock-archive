/* eslint-disable @next/next/no-img-element -- Commons thumbnails are already sized; no optimiser needed. */
import { Car, ImageOff, User } from "lucide-react";
import type { Photo, TeamSeasonEntry } from "@/data/schema";
import { chassisOf, photoKey, photoOf, resolveCar, resolveTeam, seasonLabel } from "@/lib/archive/data";
import { ClassTag, Ref } from "@/components/archive/bits";
import { cn } from "@/lib/utils";

type Aspect = "wide" | "portrait" | "card";
const ASPECT: Record<Aspect, string> = { wide: "aspect-[16/9]", portrait: "aspect-[4/5]", card: "aspect-[3/2]" };

/** A licensed photo with its credit line, or a quiet placeholder when none is on file. */
export function PhotoFigure({
  photo,
  aspect = "wide",
  kind = "car",
  note,
  priority,
  className,
}: {
  photo?: Photo;
  aspect?: Aspect;
  kind?: "car" | "person";
  /** Shown above the credit, e.g. "General photo, not from this season". */
  note?: string;
  priority?: boolean;
  className?: string;
}) {
  const Icon = kind === "person" ? User : Car;
  return (
    <figure className={cn("min-w-0", className)}>
      <div className={cn("relative overflow-hidden rounded-[var(--radius-card)] bg-surface-2", ASPECT[aspect])}>
        {photo ? (
          <img src={photo.src} alt={photo.alt} loading={priority ? "eager" : "lazy"} decoding="async" className="absolute inset-0 size-full object-cover" />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-strong">
            <Icon className="size-8 opacity-50" strokeWidth={1.5} aria-hidden />
            <span className="flex items-center gap-1 text-xs">
              <ImageOff className="size-3.5" strokeWidth={1.5} aria-hidden />
              No licensed photo yet
            </span>
          </div>
        )}
      </div>
      {photo && (
        <figcaption className="mt-1.5 text-[11px] leading-snug text-muted-strong">
          {(note ?? photo.note) && <span className="font-medium">{note ?? photo.note} · </span>}
          Photo: {photo.credit} ·{" "}
          {photo.licenseUrl ? (
            <a href={photo.licenseUrl} className="underline underline-offset-2 hover:text-ink" rel="license noopener" target="_blank">
              {photo.license}
            </a>
          ) : (
            photo.license
          )}
          {photo.page && (
            <>
              {" · "}
              <a href={photo.page} className="underline underline-offset-2 hover:text-ink" rel="noopener" target="_blank">
                Wikimedia Commons
              </a>
            </>
          )}
        </figcaption>
      )}
    </figure>
  );
}

/** Photo for one team-season entry: that season's photo, else the car's general photo, flagged as such. */
export function entryPhoto(e: TeamSeasonEntry): { photo?: Photo; note?: string } {
  const own = photoOf(photoKey.entry(e));
  if (own) return { photo: own };
  const general = photoOf(photoKey.car(e.car));
  return general ? { photo: general, note: "General photo, not from this season" } : {};
}

/** Year-by-year cards: season, chassis, class, car numbers and the car's photo from that year. */
export function SeasonCarGallery({ entries, show = "car" }: { entries: TeamSeasonEntry[]; show?: "car" | "team" }) {
  const seen = new Set<string>();
  const rows = [...entries]
    .sort((x, y) => y.season - x.season)
    .filter((e) => {
      const k = `${e.teamId}|${e.season}|${e.car}|${e.numbers.join()}`;
      return seen.has(k) ? false : (seen.add(k), true);
    });
  return (
    <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {rows.map((e) => {
        const { photo, note } = entryPhoto(e);
        const chassis = chassisOf(e);
        const car = resolveCar(e.car);
        return (
          <li key={`${e.teamId}|${e.season}|${e.car}|${e.numbers.join()}`} className="card overflow-hidden p-3">
            <PhotoFigure photo={photo} note={note} aspect="card" />
            <div className="px-1 pb-1 pt-3">
              <div className="flex items-center justify-between gap-2">
                <span className="tnum text-sm font-semibold text-accent-ink">{seasonLabel(e.season)}</span>
                <ClassTag id={e.classId} />
              </div>
              <p className="mt-1 font-semibold leading-snug text-ink">{chassis}</p>
              <dl className="mt-1.5 space-y-0.5 text-sm text-body">
                {show === "team" ? (
                  <div className="flex gap-1.5">
                    <dt className="text-muted-strong">Team</dt>
                    <dd>
                      <Ref r={resolveTeam(e.teamId, e.season)} />
                    </dd>
                  </div>
                ) : (
                  car.href &&
                  car.label !== chassis && (
                    <div className="flex gap-1.5">
                      <dt className="text-muted-strong">Model</dt>
                      <dd>
                        <Ref r={car} />
                      </dd>
                    </div>
                  )
                )}
                {show === "car" && car.href && car.label === chassis && (
                  <div className="flex gap-1.5">
                    <dt className="text-muted-strong">Car page</dt>
                    <dd>
                      <Ref r={car} />
                    </dd>
                  </div>
                )}
                {e.numbers.length > 0 && (
                  <div className="flex gap-1.5">
                    <dt className="text-muted-strong">Car no.</dt>
                    <dd className="tnum">{e.numbers.map((n) => `#${n}`).join(", ")}</dd>
                  </div>
                )}
                {e.nameUsed && show === "car" && (
                  <div className="flex gap-1.5">
                    <dt className="text-muted-strong">Entered as</dt>
                    <dd>{e.nameUsed}</dd>
                  </div>
                )}
              </dl>
              {e.note && <p className="mt-2 text-xs text-muted-strong">{e.note}</p>}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
