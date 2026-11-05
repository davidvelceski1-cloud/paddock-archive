/**
 * POST /api/corrections — reader-submitted corrections. Appended to data/corrections.jsonl
 * for an editor to review; on read-only hosts (serverless) the submission is logged instead.
 */
import fs from "node:fs/promises";
import path from "node:path";
import { z } from "zod";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const Body = z.object({
  page: z.string().trim().max(200).regex(/^\/[\w\-/?=&%.]*$/, "Invalid page"),
  message: z.string().trim().min(10).max(4_000),
  source: z.string().trim().max(500).optional(),
  email: z.union([z.literal(""), z.string().trim().email().max(200)]).optional(),
});

export async function POST(request: Request) {
  const parsed = Body.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "Please describe the correction in at least 10 characters." }, { status: 400 });
  const entry = { ...parsed.data, receivedAt: new Date().toISOString() };
  try {
    const dir = path.join(process.cwd(), "data");
    await fs.mkdir(dir, { recursive: true });
    await fs.appendFile(path.join(dir, "corrections.jsonl"), JSON.stringify(entry) + "\n", "utf8");
  } catch {
    console.info("correction", JSON.stringify(entry));
  }
  return Response.json({ ok: true });
}
