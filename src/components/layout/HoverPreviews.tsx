"use client";
/* eslint-disable @next/next/no-img-element -- remote Commons thumbnails, already sized */
import { useEffect, useRef, useState } from "react";
import type { Preview } from "@/lib/archive/previews";

const OPEN_DELAY = 280;
const CARD_W = 320;

let index: Promise<Record<string, Preview>> | null = null;
const loadIndex = (): Promise<Record<string, Preview>> =>
  (index ??= fetch("/api/previews")
    .then((r) => (r.ok ? (r.json() as Promise<Record<string, Preview>>) : {}))
    .catch(() => ({})));

type Shown = { p: Preview; x: number; y: number; above: boolean };

/**
 * One listener for the whole site: hovering (with a mouse) any link to a driver, car, team,
 * season, race or track opens a small card with the car photo, crew and specs. Touch and
 * keyboard users are unaffected; the card is decorative and never takes focus.
 */
export function HoverPreviews() {
  const [shown, setShown] = useState<Shown | null>(null);
  const timer = useRef<number | undefined>(undefined);
  const current = useRef<HTMLAnchorElement | null>(null);

  useEffect(() => {
    const hide = () => {
      window.clearTimeout(timer.current);
      current.current = null;
      setShown(null);
    };
    const over = (ev: PointerEvent) => {
      if (ev.pointerType !== "mouse") return;
      const a = (ev.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a || a === current.current) return;
      if (a.closest("[data-no-preview]")) return;
      let path: string;
      try {
        const u = new URL(a.href, location.href);
        if (u.origin !== location.origin || u.search || u.pathname === location.pathname) return;
        path = u.pathname.replace(/\/$/, "");
      } catch {
        return;
      }
      if (!/^\/(drivers|cars|teams|seasons|tracks)\/./.test(path)) return;
      hide();
      current.current = a;
      timer.current = window.setTimeout(async () => {
        const p = (await loadIndex())[path];
        if (!p || current.current !== a) return;
        const r = a.getBoundingClientRect();
        const above = r.bottom + 360 > window.innerHeight && r.top > 360;
        const x = Math.min(Math.max(12, r.left + r.width / 2 - CARD_W / 2), window.innerWidth - CARD_W - 12);
        setShown({ p, x, y: above ? r.top - 10 : r.bottom + 10, above });
      }, OPEN_DELAY);
    };
    const out = (ev: PointerEvent) => {
      const a = current.current;
      if (a && !(ev.relatedTarget instanceof Node && a.contains(ev.relatedTarget))) hide();
    };
    document.addEventListener("pointerover", over);
    document.addEventListener("pointerout", out);
    window.addEventListener("scroll", hide, { passive: true });
    window.addEventListener("blur", hide);
    return () => {
      document.removeEventListener("pointerover", over);
      document.removeEventListener("pointerout", out);
      window.removeEventListener("scroll", hide);
      window.removeEventListener("blur", hide);
    };
  }, []);

  if (!shown) return null;
  const { p, x, y, above } = shown;
  return (
    <div
      role="tooltip"
      aria-hidden
      className="preview-card pointer-events-none fixed z-[60] overflow-hidden rounded-2xl border border-line bg-surface shadow-[var(--shadow-lift)]"
      style={{ left: x, top: y, width: CARD_W, transform: above ? "translateY(-100%)" : undefined }}
    >
      {p.image && (
        <div className="relative aspect-[16/9] bg-surface-2">
          <img src={p.image.src} alt="" className="absolute inset-0 size-full object-cover" />
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/60 to-transparent" />
          <span className="absolute bottom-1 right-2 max-w-[70%] truncate text-[9px] text-white/80">{p.image.credit}</span>
          {p.inset && (
            <img
              src={p.inset.src}
              alt=""
              className={
                p.inset.round
                  ? "absolute -bottom-6 left-3 size-14 rounded-full border-2 border-[var(--surface)] object-cover shadow"
                  : "absolute bottom-2 left-2 h-14 w-20 rounded-md bg-white/90 object-contain p-1 shadow"
              }
            />
          )}
        </div>
      )}
      <div className={p.inset?.round && p.image ? "px-4 pb-4 pt-7" : "p-4"}>
        <p className="text-[11px] font-medium uppercase tracking-[0.1em] text-muted-strong">
          {p.kind}
          {p.subtitle ? ` · ${p.subtitle}` : ""}
        </p>
        <p className="mt-0.5 text-base font-semibold leading-snug text-ink">{p.title}</p>
        {p.facts.length > 0 && (
          <dl className="mt-2 space-y-1 text-[12.5px] leading-snug">
            {p.facts.map(([k, v]) => (
              <div key={k} className="grid grid-cols-[96px_1fr] gap-2">
                <dt className="text-muted-strong">{k}</dt>
                <dd className="text-body">{v}</dd>
              </div>
            ))}
          </dl>
        )}
        {p.people && <p className="mt-2 border-t border-line pt-2 text-[12.5px] leading-snug text-body">{p.people}</p>}
      </div>
    </div>
  );
}
