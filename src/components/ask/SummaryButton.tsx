"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Sparkles, X } from "lucide-react";
import type { AskSource } from "@/lib/ai/types";
import { AiLabel } from "@/components/ui/primitives";
import { CitedMarkdown, SourceChips, readEvents } from "./Answer";

type State = { text: string; sources: AskSource[]; mode?: "ai" | "offline"; error?: string; streaming: boolean };

/** "Summarize in 30 seconds": a short, cited summary generated from the page's own records. */
export function SummaryButton({ kind, id }: { kind: "team" | "driver" | "season" | "car" | "manufacturer"; id: string }) {
  const [state, setState] = useState<State | null>(null);
  const reduce = useReducedMotion();

  const run = async () => {
    setState({ text: "", sources: [], streaming: true });
    const patch = (fn: (s: State) => State) => setState((s) => (s ? fn(s) : s));
    try {
      const res = await fetch("/api/summary", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ kind, id }) });
      await readEvents(res, (e) => {
        if (e.type === "sources") patch((s) => ({ ...s, sources: e.sources }));
        else if (e.type === "text") patch((s) => ({ ...s, text: s.text + e.delta }));
        else if (e.type === "done") patch((s) => ({ ...s, mode: e.mode }));
        else if (e.type === "error") patch((s) => ({ ...s, error: e.message }));
      });
    } catch {
      patch((s) => ({ ...s, error: "Couldn't generate a summary right now." }));
    } finally {
      patch((s) => ({ ...s, streaming: false }));
    }
  };

  return (
    <div className="w-full">
      {!state && (
        <button type="button" onClick={run} className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3.5 py-1.5 text-sm font-medium text-ink shadow-card transition-colors hover:border-accent/50">
          <Sparkles className="size-4 text-accent" strokeWidth={1.5} aria-hidden />
          Summarize in 30 seconds
        </button>
      )}
      <AnimatePresence>
        {state && (
          <motion.section
            aria-label="30-second summary"
            aria-live="polite"
            initial={reduce ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="card relative mt-1 max-w-2xl p-5"
          >
            <div className="mb-2 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-ink">30-second summary</p>
                {state.mode === "offline" ? <span className="rounded-full border border-line bg-surface-2 px-2 py-0.5 text-[11px] font-medium text-body">Archive excerpt</span> : <AiLabel />}
              </div>
              <button type="button" onClick={() => setState(null)} className="rounded-full p-1 text-muted-strong hover:text-ink" aria-label="Close summary">
                <X className="size-4" strokeWidth={1.5} />
              </button>
            </div>
            {state.text ? (
              <CitedMarkdown text={state.text} sources={state.sources} streaming={state.streaming} />
            ) : state.error ? null : (
              <div className="space-y-2" aria-label="Generating summary">
                <div className="skeleton h-3.5 w-11/12" />
                <div className="skeleton h-3.5 w-3/4" />
              </div>
            )}
            {state.error && <p className="mt-2 text-sm text-[var(--hyper-ink)]">{state.error}</p>}
            {!state.streaming && state.text && <SourceChips sources={state.sources} text={state.text} />}
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
}
