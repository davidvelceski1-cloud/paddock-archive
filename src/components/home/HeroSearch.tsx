"use client";

import { useEffect, useState } from "react";
import { ArrowUp, Search, Sparkles } from "lucide-react";
import { askStore } from "@/lib/ask-store";
import { palette } from "@/components/layout/CommandPalette";

const PROMPTS = ["Which teams won Le Mans in the LMP1 hybrid era?", "Who drove for Peugeot in 2009?", "Compare Toyota and Porsche between 2014 and 2017", "Why did Nissan's LMP1 only race once?"];

/** The universal search / AI bar: questions go to the assistant, ⌘K jumps to pages. */
export function HeroSearch() {
  const [q, setQ] = useState("");
  const [mac, setMac] = useState(true);
  useEffect(() => setMac(/Mac|iPhone|iPad/.test(navigator.platform)), []);
  return (
    <div className="mx-auto max-w-2xl">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (q.trim()) askStore.open(q.trim());
        }}
        className="flex items-center gap-2 rounded-2xl border border-line-strong bg-surface/90 p-2 pl-4 shadow-lift backdrop-blur transition-colors focus-within:border-accent/60"
      >
        <Sparkles className="size-5 shrink-0 text-accent" strokeWidth={1.5} aria-hidden />
        <label htmlFor="hero-ask" className="sr-only">
          Ask the Archive
        </label>
        <input
          id="hero-ask"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Ask anything about endurance racing history…"
          className="h-11 min-w-0 flex-1 bg-transparent text-base text-ink outline-none placeholder:text-muted-strong"
        />
        <button type="button" onClick={palette.open} className="hidden items-center gap-1.5 rounded-lg border border-line px-2 py-1 text-xs text-muted-strong hover:text-ink sm:flex" aria-label="Open quick search">
          <Search className="size-3" strokeWidth={1.5} aria-hidden /> {mac ? "⌘" : "Ctrl"} K
        </button>
        <button type="submit" disabled={!q.trim()} className="btn-grad rounded-xl p-2.5 transition-opacity disabled:opacity-40" aria-label="Ask">
          <ArrowUp className="size-4" strokeWidth={2} />
        </button>
      </form>
      <ul className="mt-4 flex flex-wrap justify-center gap-2" aria-label="Suggested questions">
        {PROMPTS.map((p) => (
          <li key={p}>
            <button type="button" onClick={() => askStore.open(p)} className="rounded-full border border-line bg-surface/80 px-3 py-1.5 text-sm text-body transition-colors hover:border-line-strong hover:text-ink">
              {p}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
