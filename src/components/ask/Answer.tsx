"use client";

import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { BookOpen, Calendar, Car, Factory, Flag, Landmark, Trophy, User } from "lucide-react";
import type { AskEvent, AskSource } from "@/lib/ai/types";
import { askStore } from "@/lib/ask-store";

const KIND_ICON = { driver: User, team: Flag, season: Calendar, event: Trophy, car: Car, manufacturer: Factory, era: Landmark, lemans: Trophy, story: BookOpen } as const;

/** Reads an NDJSON AskEvent stream, calling `on` for each event. */
export async function readEvents(res: Response, on: (e: AskEvent) => void) {
  if (!res.ok || !res.body) throw new Error("Bad response");
  const reader = res.body.getReader();
  const dec = new TextDecoder();
  let buf = "";
  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    buf += dec.decode(value, { stream: true });
    let nl;
    while ((nl = buf.indexOf("\n")) >= 0) {
      const line = buf.slice(0, nl);
      buf = buf.slice(nl + 1);
      if (line) on(JSON.parse(line) as AskEvent);
    }
  }
}

/** Source chips for the passages an answer cited (all retrieved sources if none were). */
export function SourceChips({ sources, text, onNavigate }: { sources: AskSource[]; text: string; onNavigate?: () => void }) {
  const cited = new Set([...text.matchAll(/\[(\d+)\]/g)].map((m) => Number(m[1])));
  const shown = cited.size ? sources.filter((s) => cited.has(s.n)) : sources.slice(0, 4);
  if (!shown.length) return null;
  return (
    <div className="mt-3">
      <p className="mb-1.5 text-[11px] font-medium uppercase tracking-wider text-muted-strong">Sources in the archive</p>
      <ul className="flex flex-wrap gap-1.5">
        {shown.map((s) => {
          const Icon = KIND_ICON[s.kind as keyof typeof KIND_ICON] ?? BookOpen;
          return (
            <li key={s.n}>
              <Link href={s.href} onClick={onNavigate} className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-2.5 py-1 text-xs text-body transition-colors hover:border-line-strong hover:text-ink">
                <span className="tnum text-muted-strong">{s.n}</span>
                <Icon className="size-3" strokeWidth={1.5} aria-hidden />
                {s.title}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/** Markdown answer with [n] citations rendered as small linked markers. */
export function CitedMarkdown({ text, sources, streaming }: { text: string; sources: AskSource[]; streaming?: boolean }) {
  const byN = new Map(sources.map((s) => [s.n, s]));
  const md = text.replace(/\[(\d+)\]/g, (m, n) => (byN.has(Number(n)) ? `[${n}](cite:${n})` : m));
  return (
    <div className="prose-archive text-[15px] leading-relaxed text-body [&_li]:mt-1 [&_ol]:mt-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_strong]:text-ink [&_table]:mt-3 [&_table]:w-full [&_table]:text-sm [&_td]:border-b [&_td]:border-line [&_td]:py-1 [&_th]:border-b [&_th]:border-line [&_th]:py-1 [&_th]:text-left [&_ul]:mt-2 [&_ul]:list-disc [&_ul]:pl-5">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        urlTransform={(url) => url}
        components={{
          a: ({ href, children }) => {
            if (href?.startsWith("cite:")) {
              const s = byN.get(Number(href.slice(5)));
              return s ? (
                <Link
                  href={s.href}
                  onClick={() => askStore.close()}
                  title={s.title}
                  aria-label={`Source ${s.n}: ${s.title}`}
                  className="tnum mx-0.5 inline-flex h-4 min-w-4 -translate-y-0.5 items-center justify-center rounded-full bg-accent-soft px-1 align-middle text-[10px] font-medium text-accent-ink no-underline ring-1 ring-accent/20 hover:ring-accent"
                >
                  {children}
                </Link>
              ) : (
                <>{children}</>
              );
            }
            return href?.startsWith("/") ? <Link href={href}>{children}</Link> : <a href={href} rel="noreferrer">{children}</a>;
          },
        }}
      >
        {md}
      </ReactMarkdown>
      {streaming && <span className="ml-0.5 inline-block h-4 w-1.5 animate-pulse rounded-sm bg-accent/60 align-middle" aria-hidden />}
    </div>
  );
}
