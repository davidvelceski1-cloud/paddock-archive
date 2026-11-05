/**
 * POST /api/ask — "Ask the Archive". Retrieve passages (BM25 over the archive, plus the
 * page being viewed), send the numbered sources, then stream Claude's cited answer.
 */
import { z } from "zod";
import { retrieve } from "@/lib/ai/retrieval";
import { SYSTEM_PROMPT } from "@/lib/ai/prompt";
import { extractiveAnswer, passagesBlock, streamGrounded } from "@/lib/ai/stream";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const RequestSchema = z.object({
  question: z.string().trim().min(1).max(1_000),
  history: z.array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().max(12_000) })).max(20),
  context: z.object({ kind: z.string().max(20), id: z.string().max(80).optional(), label: z.string().max(120).optional() }).optional(),
});

const CONTEXT_KINDS = ["driver", "team", "season", "event", "car", "manufacturer", "story"];

export async function POST(request: Request) {
  const parsed = RequestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "Invalid request" }, { status: 400 });
  const { question, history, context } = parsed.data;

  // Include the previous question so follow-ups ("and his teammates?") still retrieve well.
  const lastUser = [...history].reverse().find((m) => m.role === "user")?.content ?? "";
  const ctxId = context?.id && CONTEXT_KINDS.includes(context.kind) ? `${context.kind}:${context.id}` : undefined;
  const docs = retrieve(`${question} ${lastUser}`, ctxId);
  const page = context?.label ? `The reader is viewing the ${context.kind} page for: ${context.label}.` : "The reader is browsing the archive.";

  return streamGrounded({
    system: SYSTEM_PROMPT,
    docs,
    maxTokens: 16_000,
    refusalText: "I can't help with that one, but ask me anything about endurance racing history.",
    // Earlier turns are replayed as plain text; this turn carries fresh passages.
    messages: [
      ...history.map((m) => ({ role: m.role, content: m.content })),
      { role: "user", content: `${passagesBlock(docs)}\n\n<page_context>${page}</page_context>\n\n<question>${question}</question>` },
    ],
    offline: () => {
      const picks = extractiveAnswer(question, docs);
      if (!picks) return "The archive has no pages matching that question yet. Try naming a season, team, driver or car.";
      return `Written answers are switched off on this deployment (no AI key is configured), so here are the archive passages that best match your question:\n\n${picks.map((p) => `- **${p.d.title}**: ${p.line} [${p.n}]`).join("\n")}`;
    },
  });
}
