"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, Moon, Search, Sparkles, Sun, X } from "lucide-react";
import { askStore } from "@/lib/ask-store";
import { palette } from "./CommandPalette";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/seasons", label: "Seasons" },
  { href: "/teams", label: "Teams" },
  { href: "/drivers", label: "Drivers" },
  { href: "/cars", label: "Cars" },
  { href: "/tracks", label: "Tracks" },
  { href: "/compare", label: "Compare" },
];

function ThemeToggle() {
  const [dark, setDark] = useState(false);
  useEffect(() => setDark(document.documentElement.classList.contains("dark")), []);
  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {}
  };
  return (
    <button type="button" onClick={toggle} className="rounded-full p-2 text-muted-strong transition-colors hover:text-ink" aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}>
      {dark ? <Sun className="size-4" strokeWidth={1.5} /> : <Moon className="size-4" strokeWidth={1.5} />}
    </button>
  );
}

/** Original mark: a 24-hour dial sweeping three quarters of the way round, drawn in monochrome line. No third-party logos. */
export function Mark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={cn("text-ink", className)} aria-hidden>
      <path d="M12 4a8 8 0 1 1-8 8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="12" cy="12" r="1.8" fill="currentColor" />
      <path d="M12 12 16 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function Wordmark() {
  return (
    <Link href="/" className="flex items-center gap-1.5 rounded-md opacity-90 transition-opacity hover:opacity-100" aria-label="Paddock Archive, home">
      <Mark className="size-[18px]" />
      <span className="text-[14px] font-semibold tracking-tight text-ink">Paddock Archive</span>
    </Link>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const [menu, setMenu] = useState(false);
  const [mac, setMac] = useState(true);
  useEffect(() => setMac(/Mac|iPhone|iPad/.test(navigator.platform)), []);
  useEffect(() => setMenu(false), [pathname]);

  return (
    <header className="sticky top-0 z-30 bg-[color-mix(in_srgb,var(--bg)_80%,transparent)] backdrop-blur-xl backdrop-saturate-[1.8]">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-md focus:bg-surface focus:px-3 focus:py-1.5">
        Skip to content
      </a>
      <div className="mx-auto flex h-12 max-w-[1024px] items-center gap-6 px-4 sm:px-6">
        <Wordmark />
        <nav aria-label="Primary" className="hidden flex-1 md:block">
          <ul className="flex items-center justify-center gap-7">
            {NAV.map((n) => {
              const active = pathname.startsWith(n.href) || (n.href === "/cars" && pathname.startsWith("/manufacturers"));
              return (
                <li key={n.href}>
                  <Link
                    href={n.href}
                    aria-current={active ? "page" : undefined}
                    className={cn("text-[12px] tracking-normal transition-colors duration-200", active ? "text-ink" : "text-body/80 hover:text-ink")}
                  >
                    {n.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="ml-auto flex items-center gap-1 md:ml-0">
          <button type="button" onClick={palette.open} className="rounded-full p-2 text-body/80 transition-colors hover:text-ink" aria-label={`Search (${mac ? "⌘" : "Ctrl"} K)`}>
            <Search className="size-4" strokeWidth={1.5} />
          </button>
          <button type="button" onClick={() => askStore.open()} className="btn-grad ml-1 flex items-center gap-1 rounded-full px-3 py-1 text-[12px] font-normal">
            <Sparkles className="size-3" strokeWidth={1.5} aria-hidden />
            <span className="hidden sm:inline">Ask the Archive</span>
            <span className="sm:hidden">Ask</span>
          </button>
          <ThemeToggle />
          <button type="button" onClick={() => setMenu((m) => !m)} className="rounded-full p-2 text-muted-strong hover:text-ink md:hidden" aria-expanded={menu} aria-label="Menu">
            {menu ? <X className="size-4" strokeWidth={1.5} /> : <Menu className="size-4" strokeWidth={1.5} />}
          </button>
        </div>
      </div>
      {menu && (
        <nav aria-label="Primary" className="bg-bg md:hidden">
          <ul className="mx-auto max-w-6xl px-8 pb-8 pt-4">
            {[...NAV, { href: "/le-mans", label: "Le Mans winners" }, { href: "/ask", label: "Ask the Archive" }].map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="block py-2 text-2xl font-semibold tracking-tight text-ink transition-colors hover:text-accent-ink">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
