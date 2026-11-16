"use client";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * A horizontally scrolling row of chips with arrow buttons at either end. The arrows
 * only appear when there is more to see in that direction; wheel, trackpad and touch
 * scrolling keep working as before.
 */
export function ScrollRow({ children, className, label }: { children: ReactNode; className?: string; label?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ left: false, right: false });

  const update = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    setEdges({ left: el.scrollLeft > 2, right: el.scrollLeft + el.clientWidth < el.scrollWidth - 2 });
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    update();
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    // Keep the selected chip in view when the page loads with a filter applied (row only, never the page).
    const on = el.querySelector<HTMLElement>('[aria-current="true"]');
    if (on && on.offsetLeft + on.offsetWidth > el.clientWidth) el.scrollLeft = on.offsetLeft - el.clientWidth / 2 + on.offsetWidth / 2;
    return () => {
      el.removeEventListener("scroll", update);
      ro.disconnect();
    };
  }, [update]);

  const go = (dir: -1 | 1) => ref.current?.scrollBy({ left: dir * Math.max(160, ref.current.clientWidth * 0.7), behavior: "smooth" });

  const arrow = (dir: -1 | 1, show: boolean) => (
    <button
      type="button"
      onClick={() => go(dir)}
      aria-label={`${dir < 0 ? "Previous" : "More"}${label ? ` ${label.toLowerCase()}` : ""} options`}
      tabIndex={show ? 0 : -1}
      className={cn(
        "absolute top-1/2 z-[1] grid size-7 -translate-y-1/2 place-items-center rounded-full border border-line bg-surface text-ink shadow-sm transition-opacity duration-150 hover:border-line-strong",
        dir < 0 ? "left-0" : "right-0",
        show ? "opacity-100" : "pointer-events-none opacity-0",
      )}
    >
      {dir < 0 ? <ChevronLeft className="size-4" strokeWidth={2} aria-hidden /> : <ChevronRight className="size-4" strokeWidth={2} aria-hidden />}
    </button>
  );

  return (
    <div className={cn("relative min-w-0 flex-1", className)}>
      {/* Fades hint that the row continues under the arrows. */}
      <div className={cn("pointer-events-none absolute inset-y-0 left-0 z-[1] w-12 bg-gradient-to-r from-[var(--surface)] to-transparent transition-opacity", edges.left ? "opacity-100" : "opacity-0")} />
      <div className={cn("pointer-events-none absolute inset-y-0 right-0 z-[1] w-12 bg-gradient-to-l from-[var(--surface)] to-transparent transition-opacity", edges.right ? "opacity-100" : "opacity-0")} />
      {arrow(-1, edges.left)}
      <div ref={ref} className="no-scrollbar flex gap-1.5 overflow-x-auto scroll-smooth px-0.5 py-0.5">
        {children}
      </div>
      {arrow(1, edges.right)}
    </div>
  );
}
