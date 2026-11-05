"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

/** Natural-language filter input: the server turns the sentence into URL filters (chips). */
export function NLFilterBar({ scope, examples, className }: { scope: "teams" | "drivers"; examples: string[]; className?: string }) {
  const [q, setQ] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const router = useRouter();
  const pathname = usePathname();

  const run = async (text: string) => {
    const t = text.trim();
    if (t.length < 2) return;
    setError(null);
    try {
      const res = await fetch("/api/nl-filter", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ q: t, scope }) });
      if (!res.ok) throw new Error();
      const { params } = (await res.json()) as { params: string };
      if (!params) {
        setError("Couldn't turn that into filters. Try naming a country, class, status, decade or manufacturer.");
        return;
      }
      start(() => router.push(`${pathname}?${params}`, { scroll: false }));
    } catch {
      setError("Couldn't reach the archive. Please try again.");
    }
  };

  return (
    <div className={className}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          run(q);
        }}
        className="flex items-center gap-2 rounded-2xl border border-line-strong bg-surface p-1.5 pl-3.5 shadow-card transition-colors focus-within:border-accent/60"
      >
        <Sparkles className="size-4 shrink-0 text-accent" strokeWidth={1.5} aria-hidden />
        <label htmlFor={`nl-${scope}`} className="sr-only">
          Describe what you are looking for
        </label>
        <input
          id={`nl-${scope}`}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={`Describe the ${scope} you want — e.g. “${examples[0]}”`}
          className="h-9 min-w-0 flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-muted-strong"
        />
        <button type="submit" disabled={pending || q.trim().length < 2} className="btn-grad inline-flex items-center gap-1 rounded-xl px-3 py-2 text-sm font-medium transition-opacity disabled:opacity-40">
          {pending ? "Filtering…" : "Filter"}
          <ArrowRight className="size-3.5" strokeWidth={1.5} aria-hidden />
        </button>
      </form>
      {error && (
        <p role="alert" className="mt-2 text-sm text-[var(--hyper-ink)]">
          {error}
        </p>
      )}
      <ul className="mt-2.5 flex flex-wrap gap-1.5" aria-label="Example filters">
        {examples.map((ex) => (
          <li key={ex}>
            <button
              type="button"
              onClick={() => {
                setQ(ex);
                run(ex);
              }}
              className={cn("rounded-full border border-line px-2.5 py-1 text-xs text-body transition-colors hover:border-line-strong hover:text-ink")}
            >
              {ex}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
