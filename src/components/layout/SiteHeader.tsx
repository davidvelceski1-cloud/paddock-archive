"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState } from "react";
import { Menu, Moon, Search, Sparkles, Sun, X } from "lucide-react";
import { askStore } from "@/lib/ask-store";
import { palette } from "./CommandPalette";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/seasons", label: "Seasons" },
  { href: "/teams", label: "Teams" },
  { href: "/drivers", label: "Drivers" },
  { href: "/cars", label: "Cars" },
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

/** Original mark: a 24-hour dial sweeping three quarters of the way round. No third-party logos. */
export function Mark({ className }: { className?: string }) {
  const id = `pa-grad-${useId().replace(/:/g, "")}`;
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#6366F1" />
          <stop offset=".55" stopColor="#8B5CF6" />
          <stop offset="1" stopColor="#F97362" />
        </linearGradient>
      </defs>
      <rect width="24" height="24" rx="7" fill={`url(#${id})`} />
      <path d="M12 5.5a6.5 6.5 0 1 1-6.5 6.5" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
      <circle cx="12" cy="12" r="1.6" fill="#fff" />
      <path d="M12 12 15.2 8.8" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function Wordmark() {
  return (
    <Link href="/" className="flex items-center gap-2 rounded-md" aria-label="Paddock Archive, home">
      <Mark className="size-6" />
      <span className="text-[15px] font-semibold tracking-tight text-ink">
        Paddock <span className="font-normal text-body">Archive</span>
      </span>
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
    <header className="sticky top-0 z-30 border-b border-line/70 bg-bg/70 backdrop-blur-xl backdrop-saturate-150">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-md focus:bg-surface focus:px-3 focus:py-1.5">
        Skip to content
      </a>
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-6 px-4 sm:px-6">
        <Wordmark />
        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {NAV.map((n) => {
              const active = pathname.startsWith(n.href) || (n.href === "/cars" && pathname.startsWith("/manufacturers"));
              return (
                <li key={n.href}>
                  <Link
                    href={n.href}
                    aria-current={active ? "page" : undefined}
                    className={cn("rounded-full px-3 py-1.5 text-sm transition-colors duration-150", active ? "bg-surface-2 text-ink" : "text-body hover:text-ink")}
                  >
                    {n.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="ml-auto flex items-center gap-1.5">
          <button
            type="button"
            onClick={palette.open}
            className="hidden items-center gap-2 rounded-full border border-line bg-surface px-3 py-1.5 text-sm text-muted-strong shadow-card transition-colors hover:border-line-strong hover:text-ink sm:flex"
          >
            <Search className="size-3.5" strokeWidth={1.5} aria-hidden />
            Search
            <kbd className="ml-3 rounded border border-line px-1 font-sans text-[10px]">{mac ? "⌘" : "Ctrl"} K</kbd>
          </button>
          <button type="button" onClick={palette.open} className="rounded-full p-2 text-muted-strong hover:text-ink sm:hidden" aria-label="Search">
            <Search className="size-4" strokeWidth={1.5} />
          </button>
          <button type="button" onClick={() => askStore.open()} className="btn-grad flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium shadow-card transition-opacity hover:opacity-90">
            <Sparkles className="size-3.5" strokeWidth={1.5} aria-hidden />
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
        <nav aria-label="Primary" className="border-t border-line bg-bg md:hidden">
          <ul className="mx-auto grid max-w-6xl grid-cols-2 gap-1 px-4 py-3">
            {[...NAV, { href: "/le-mans", label: "Le Mans winners" }, { href: "/ask", label: "Ask the Archive" }].map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="block rounded-lg px-3 py-2 text-sm text-body hover:bg-surface-2 hover:text-ink">
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
