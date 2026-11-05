/**
 * POST /api/nl-filter — turn "French teams that left before 2015" into structured filters.
 * Claude only maps the text onto a fixed filter schema (structured output); the archive
 * applies the filters, so every listed row comes from the data.
 */
import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { ClassId } from "@/data/schema";
import { FALLBACK, MODEL, hasCredentials } from "@/lib/ai/prompt";
import { VOCAB, parseWithRules, toParams, type Filters, type Scope } from "@/lib/search/filters";
import { ix } from "@/lib/archive/data";
import { COUNTRIES } from "@/data/countries";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const Body = z.object({ q: z.string().trim().min(2).max(300), scope: z.enum(["teams", "drivers"]) });

const n = (type: "string" | "integer" | "boolean", description: string, extra: Record<string, unknown> = {}) => ({ type: [type, "null"], description, ...extra });

const SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["status", "country", "class", "manufacturer", "team", "decade", "era", "leftBefore", "leftAfter", "activeIn", "champion", "lemans", "q"],
  properties: {
    status: n("string", "active, defunct (teams that no longer race) or retired (drivers no longer racing in the WEC).", { enum: ["active", "defunct", "retired", null] }),
    country: n("string", "ISO 3166-1 alpha-2 code from the vocabulary, for team country or driver nationality."),
    class: n("string", "Racing class id from the vocabulary."),
    manufacturer: n("string", "Manufacturer id from the vocabulary."),
    team: n("string", "Team id — drivers scope only, for 'drove for X'."),
    decade: n("integer", "First year of a decade, e.g. 2010 for 'the 2010s'."),
    era: n("string", "Era slug from the vocabulary."),
    leftBefore: n("integer", "Teams whose last season ended before this year."),
    leftAfter: n("integer", "Teams whose last season ended after this year."),
    activeIn: n("integer", "Raced in this specific year."),
    champion: n("boolean", "true only if the reader asks for world champions / title winners."),
    lemans: n("boolean", "true only if the reader asks for Le Mans winners."),
    q: n("string", "Leftover name text to match, only if the reader typed a name that fits no other field."),
  },
} as const;

/** Drop anything outside the vocabulary so the model can't introduce filters the data can't satisfy. */
function sanitize(raw: Record<string, unknown>): Filters {
  const f: Filters = {};
  const str = (k: string) => (typeof raw[k] === "string" && raw[k] ? (raw[k] as string) : undefined);
  const int = (k: string) => (Number.isInteger(raw[k]) ? (raw[k] as number) : undefined);
  const status = str("status");
  if (status === "active" || status === "defunct" || status === "retired") f.status = status;
  if (str("country") && COUNTRIES[str("country")!]) f.country = str("country");
  const cls = ClassId.safeParse(str("class"));
  if (cls.success && cls.data !== "overall") f.class = cls.data;
  if (str("manufacturer") && ix().manufacturers.has(str("manufacturer")!)) f.manufacturer = str("manufacturer");
  if (str("team") && ix().teams.has(str("team")!)) f.team = str("team");
  if (str("era") && ix().eras.has(str("era")!)) f.era = str("era");
  for (const k of ["decade", "leftBefore", "leftAfter", "activeIn"] as const) if (int(k) !== undefined) f[k] = int(k);
  if (raw.champion === true) f.champion = true;
  if (raw.lemans === true) f.lemans = true;
  if (str("q")) f.q = str("q");
  return f;
}

async function parseWithClaude(q: string, scope: Scope): Promise<Filters | null> {
  const client = new Anthropic();
  const v = VOCAB();
  const res = await client.beta.messages.create({
    model: MODEL,
    max_tokens: 1024,
    system: `Map a reader's filter request for the ${scope} list of an endurance-racing archive onto structured filters. Fill only what the reader actually asked for and leave every other field null; never guess names they did not mention. Use ids exactly as given in this vocabulary.\nCountries: ${v.countries}\nClasses: ${v.classes}\nManufacturers: ${v.manufacturers}\nTeams: ${v.teams}\nEras: ${v.eras}`,
    messages: [{ role: "user", content: q }],
    output_config: { effort: "low", format: { type: "json_schema", schema: SCHEMA as unknown as Record<string, unknown> } },
    ...FALLBACK,
  });
  if (res.stop_reason === "refusal") return null;
  const text = res.content.find((b) => b.type === "text");
  if (!text || text.type !== "text") return null;
  return sanitize(JSON.parse(text.text));
}

export async function POST(request: Request) {
  const body = Body.safeParse(await request.json().catch(() => null));
  if (!body.success) return Response.json({ error: "Type at least two characters." }, { status: 400 });
  const { q, scope } = body.data;
  let filters: Filters | null = null;
  let mode: "ai" | "rules" = "rules";
  if (hasCredentials()) {
    try {
      filters = await parseWithClaude(q, scope);
      if (filters) mode = "ai";
    } catch (err) {
      if (!(err instanceof Anthropic.APIError || err instanceof SyntaxError)) throw err;
      console.error("nl-filter: falling back to rules", err instanceof Anthropic.APIError ? err.status : err.message);
    }
  }
  filters ??= parseWithRules(q, scope);
  return Response.json({ params: toParams(filters).toString(), mode });
}
