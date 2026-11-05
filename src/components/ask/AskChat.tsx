"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowUp, RotateCcw } from "lucide-react";
import type { AskSource } from "@/lib/ai/types";
import { askStore, useAsk } from "@/lib/ask-store";
import { AiLabel } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";
import { CitedMarkdown, SourceChips, readEvents } from "./Answer";

type Msg = { role: "user" | "assistant"; content: string; sources?: AskSource[]; mode?: "ai" | "offline"; error?: string; streaming?: boolean };

const GENERAL = [
  "Which teams won Le Mans in the LMP1 hybrid era?",
  "Who drove for Peugeot in 2009?",
  "Compare Toyota and Porsche between 2014 and 2017",
  "Why did Audi leave the WEC?",
];

// The panel unmounts when closed; keep its conversation for the session.
let panelHistory: Msg[] = [];

export function AskChat({ variant = "panel" }: { variant?: "panel" | "page" }) {
  const { context, open } = useAsk();
  const [messages, setMessages] = useState<Msg[]>(() => (variant === "panel" ? panelHistory : []));
  useEffect(() => {
    if (variant === "panel") panelHistory = messages.filter((m) => !m.streaming);
  }, [messages, variant]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const ask = useCallback(
    async (question: string) => {
      const q = question.trim();
      if (!q || busy) return;
      setBusy(true);
      setInput("");
      const history = messages.filter((m) => !m.error).map((m) => ({ role: m.role, content: m.content.replace(/\[\d+\]/g, "") }));
      setMessages((m) => [...m, { role: "user", content: q }, { role: "assistant", content: "", streaming: true }]);
      const patch = (fn: (m: Msg) => Msg) => setMessages((all) => [...all.slice(0, -1), fn(all[all.length - 1])]);
      try {
        const res = await fetch("/api/ask", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question: q, history: history.slice(-10), context: context.id ? { kind: context.kind, id: context.id, label: context.label } : undefined }),
        });
        await readEvents(res, (e) => {
          if (e.type === "sources") patch((m) => ({ ...m, sources: e.sources }));
          else if (e.type === "text") patch((m) => ({ ...m, content: m.content + e.delta }));
          else if (e.type === "done") patch((m) => ({ ...m, mode: e.mode }));
          else if (e.type === "error") patch((m) => ({ ...m, error: e.message }));
        });
      } catch {
        patch((m) => ({ ...m, error: "Couldn't reach the archive. Check your connection and try again." }));
      } finally {
        patch((m) => ({ ...m, streaming: false }));
        setBusy(false);
      }
    },
    [busy, messages, context],
  );

  // Questions queued by suggested-prompt pills elsewhere on the page.
  useEffect(() => {
    if (variant === "panel" && !open) return;
    const pending = askStore.consumePending();
    if (pending) ask(pending);
    else inputRef.current?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, variant]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  const suggestions = context.suggestions.length ? context.suggestions : GENERAL;

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className={cn("min-h-0 flex-1 overflow-y-auto", variant === "panel" ? "px-5 py-4" : "py-2")} aria-live="polite">
        {messages.length === 0 ? (
          <div className="rise">
            <p className="display text-2xl">What would you like to know?</p>
            <p className="mt-2 text-sm text-body">
              Answers come only from the archive's own records, with sources. If the archive doesn't have something, the answer says so.
              {context.label && (
                <>
                  {" "}
                  You're viewing <span className="font-medium text-ink">{context.label}</span>.
                </>
              )}
            </p>
            <ul className="mt-5 flex flex-wrap gap-2">
              {suggestions.map((s) => (
                <li key={s}>
                  <button type="button" onClick={() => ask(s)} className="rounded-full border border-line bg-surface px-3.5 py-1.5 text-left text-sm text-body transition-colors hover:border-line-strong hover:text-ink">
                    {s}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <ol className="space-y-6">
            {messages.map((m, i) => (
              <li key={i} className="rise">
                {m.role === "user" ? (
                  <p className="ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-md bg-ink px-3.5 py-2 text-sm text-[var(--bg)]">{m.content}</p>
                ) : (
                  <div>
                    <div className="mb-2">{m.mode === "offline" ? <span className="rounded-full border border-line bg-surface-2 px-2 py-0.5 text-[11px] font-medium text-body">Archive excerpts</span> : <AiLabel />}</div>
                    {m.content || m.error ? (
                      <>
                        <CitedMarkdown text={m.content} sources={m.sources ?? []} streaming={m.streaming} />
                        {m.error && <p className="mt-2 rounded-lg bg-[var(--hyper-bg)] px-3 py-2 text-sm text-[var(--hyper-ink)]">{m.error}</p>}
                        {!m.streaming && m.sources && <SourceChips sources={m.sources} text={m.content} onNavigate={() => askStore.close()} />}
                      </>
                    ) : (
                      <div className="space-y-2" aria-label="Loading answer">
                        <div className="skeleton h-3.5 w-11/12" />
                        <div className="skeleton h-3.5 w-4/5" />
                        <div className="skeleton h-3.5 w-2/3" />
                      </div>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ol>
        )}
        <div ref={endRef} />
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          ask(input);
        }}
        className={cn("border-t border-line", variant === "panel" ? "px-4 py-3" : "pt-4")}
      >
        <div className="flex items-end gap-2 rounded-2xl border border-line-strong bg-surface p-1.5 pl-3.5 shadow-card focus-within:border-accent/60">
          <label htmlFor={`ask-${variant}`} className="sr-only">
            Ask the Archive
          </label>
          <textarea
            id={`ask-${variant}`}
            ref={inputRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                ask(input);
              }
            }}
            placeholder={context.label ? `Ask about ${context.label}…` : "Ask about any season, team or driver…"}
            className="max-h-32 min-h-[36px] flex-1 resize-none bg-transparent py-2 text-sm text-ink outline-none placeholder:text-muted-strong"
          />
          {messages.length > 0 && !busy && (
            <button type="button" onClick={() => setMessages([])} className="rounded-full p-2 text-muted-strong hover:text-ink" aria-label="Start a new conversation">
              <RotateCcw className="size-4" strokeWidth={1.5} />
            </button>
          )}
          <button type="submit" disabled={busy || !input.trim()} className="btn-grad rounded-full p-2 transition-opacity disabled:opacity-40" aria-label="Send question">
            <ArrowUp className="size-4" strokeWidth={2} />
          </button>
        </div>
        <p className="mt-2 text-center text-[11px] text-muted-strong">Answers are AI-generated from archive records and may contain mistakes. Check the cited pages.</p>
      </form>
    </div>
  );
}
