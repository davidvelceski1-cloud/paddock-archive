/**
 * POST /api/summary — the "Summarize in 30 seconds" button. Summarises one entity page
 * from its own passage plus a few closely related ones, cited like Ask answers.
 */
import { z } from "zod";
import { docFor } from "@/lib/ai/documents";
import { retrieve } from "@/lib/ai/retrieval";
import { SUMMARY_PROMPT } from "@/lib/ai/prompt";
import { passagesBlock, streamGrounded } from "@/lib/ai/stream";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const Body = z.object({ kind: z.enum(["team", "driver", "season", "car", "manufacturer"]), id: z.string().min(1).max(80) });

export async function POST(request: Request) {
  const parsed = Body.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "Invalid request" }, { status: 400 });
  const main = docFor(`${parsed.data.kind}:${parsed.data.id}`);
  if (!main) return Response.json({ error: "Not found" }, { status: 404 });
  const docs = retrieve(main.title, main.id, 4);

  return streamGrounded({
    system: SUMMARY_PROMPT,
    docs,
    maxTokens: 2_000,
    refusalText: "A summary isn't available for this page.",
    messages: [{ role: "user", content: `${passagesBlock(docs)}\n\nSummarise the page "${main.title}" (passage 1).` }],
    // Offline: the page's own prose lines (not its stat lines), cited to the page.
    offline: () =>
      main.text
        .split("\n")
        .filter((l) => l.trim())
        .filter((l) => !/^[^.:]{3,70}:/.test(l) || /^(History — founding|Peak|Exit|Why they left|Story of the season|Powertrain):/.test(l))
        .map((l) => l.replace(/^(History — founding|Peak|Exit|Why they left|Story of the season|Powertrain):\s*/, ""))
        .slice(0, 3)
        .map((l) => `${l.length > 300 ? `${l.slice(0, 300).replace(/[;,][^;,]*$/, "")}…` : l} [1]`)
        .join(" "),
  });
}
