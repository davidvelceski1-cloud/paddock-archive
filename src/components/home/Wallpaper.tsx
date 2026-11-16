"use client";
/* eslint-disable @next/next/no-img-element -- remote Commons thumbnails, already sized */
import { useEffect, useState } from "react";

export type WallpaperPhoto = { src: string; alt: string; credit: string };

const INTERVAL = 7000;

/**
 * Phone-wallpaper-style background: full-bleed photos that slowly zoom and pan, then
 * crossfade to the next. Pauses while the tab is hidden; with reduced motion it shows
 * still photos and changes them less often, without the zoom.
 */
export function Wallpaper({
  photos,
  className,
  creditClassName = "right-3 bottom-2 z-[2] text-white/70",
  randomStart = false,
}: {
  photos: WallpaperPhoto[];
  className?: string;
  creditClassName?: string;
  /** Start on a random photo (client-only slideshows, so pages don't all open on the same one). */
  randomStart?: boolean;
}) {
  const [i, setI] = useState(() => (randomStart && photos.length ? Math.floor(Math.random() * photos.length) : 0));
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const on = () => setReduced(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  useEffect(() => {
    if (photos.length < 2) return;
    const id = window.setInterval(() => {
      if (!document.hidden) setI((n) => (n + 1) % photos.length);
    }, reduced ? INTERVAL * 2 : INTERVAL);
    return () => window.clearInterval(id);
  }, [photos.length, reduced]);

  // Preload the next photo so the crossfade never shows a blank frame.
  useEffect(() => {
    const next = photos[(i + 1) % photos.length];
    if (next) new Image().src = next.src;
  }, [i, photos]);

  if (!photos.length) return null;
  const cur = photos[i % photos.length];
  return (
    <div className={className} aria-hidden>
      {photos.map((p, n) => {
        // Render only the current and previous slides; the rest stay unloaded.
        const active = n === i;
        const prev = n === (i - 1 + photos.length) % photos.length;
        if (!active && !prev) return null;
        // The wrapper fades in over the previous slide; the image inside zooms continuously.
        return (
          <div key={p.src} className={`wallpaper-slide ${active ? "is-active" : ""}`}>
            <img src={p.src} alt="" decoding="async" className={`wallpaper-img ${n % 2 ? "pan-left" : "pan-right"}`} />
          </div>
        );
      })}
      <span className={`absolute max-w-[60%] truncate text-[10px] ${creditClassName}`}>Photo: {cur.credit}</span>
    </div>
  );
}
