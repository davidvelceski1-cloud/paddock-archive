import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import type { Doc } from "./documents";
import { tokenize } from "./retrieval";
import { FALLBACK, MODEL, hasCredentials } from "./prompt";
import type { AskEvent, AskSource } from "./types";

export const toSources = (docs: Doc[]): AskSource[] => docs.map((d, i) => ({ n: i + 1, id: d.id, kind: d.kind, title: d.title, href: d.href }));

export const passagesBlock = (docs: Doc[]) =>
  `<archive_passages>\n${docs.map((d, i) => `<passage n="${i + 1}" title="${d.title}" page="${d.href}">\n${d.text}\n</passage>`).join("\n")}\n</archive_passages>`;

/** Best-matching lines of the top passages, cited — the answer when no model is available. */
export function extractiveAnswer(question: string, docs: Doc[], max = 3) {
  if (!docs.length) return null;
  const q = new Set(tokenize(question).map((t) => t.replace(/s$/, "")));
  return docs
    .map((d, i) => {
      const best = d.text
        .split("\n")
        .map((line) => ({ line, score: tokenize(line).filter((t) => q.has(t.replace(/s$/, ""))).length }))
        .sort((a, b) => b.score - a.score)[0];
      const line = best.line.length > 380 ? `${best.line.slice(0, 380).replace(/[;,][^;,]*$/, "")}…` : best.line;
      return { d, n: i + 1, line: line.trim(), score: best.score };
    })
    .filter((p, i) => i === 0 || p.score > 0)
    .slice(0, max);
}

/**
 * Streams newline-delimited JSON AskEvents: the numbered sources first, then Claude's text
 * (which cites them as [n]). Falls back to an extractive, still-cited answer without credentials.
 */
export function streamGrounded(opts: {
  system: string;
  messages: Anthropic.Beta.BetaMessageParam[];
  docs: Doc[];
  offline: () => string;
  maxTokens: number;
  refusalText: string;
}) {
  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const emit = (e: AskEvent) => controller.enqueue(encoder.encode(JSON.stringify(e) + "\n"));
      emit({ type: "sources", sources: toSources(opts.docs) });
      const offline = () => {
        emit({ type: "text", delta: opts.offline() });
        emit({ type: "done", mode: "offline" });
      };
      if (!hasCredentials()) {
        offline();
        controller.close();
        return;
      }
      try {
        const client = new Anthropic();
        const s = client.beta.messages.stream({
          model: MODEL,
          max_tokens: opts.maxTokens,
          system: opts.system,
          messages: opts.messages,
          output_config: { effort: "low" },
          cache_control: { type: "ephemeral" },
          ...FALLBACK,
        });
        s.on("text", (delta) => emit({ type: "text", delta }));
        const message = await s.finalMessage();
        if (message.stop_reason === "refusal") emit({ type: "text", delta: `\n\n${opts.refusalText}` });
        emit({ type: "done", mode: "ai" });
      } catch (err) {
        if (err instanceof Anthropic.AuthenticationError) offline();
        else if (err instanceof Anthropic.RateLimitError) emit({ type: "error", message: "The archivist is busy right now. Please try again in a moment." });
        else if (err instanceof Anthropic.APIError) {
          console.error("Claude API error", err.status, err.message);
          emit({ type: "error", message: "Something went wrong reaching the archivist. Please try again." });
        } else {
          console.error(err);
          emit({ type: "error", message: "Something went wrong. Please try again." });
        }
      } finally {
        controller.close();
      }
    },
  });
  return new Response(stream, { headers: { "Content-Type": "application/x-ndjson; charset=utf-8", "Cache-Control": "no-store" } });
}
