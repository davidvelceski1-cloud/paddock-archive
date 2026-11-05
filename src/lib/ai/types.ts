export type AskSource = { n: number; id: string; kind: string; title: string; href: string };

export type AskEvent =
  | { type: "sources"; sources: AskSource[] }
  | { type: "text"; delta: string }
  | { type: "done"; mode: "ai" | "offline" }
  | { type: "error"; message: string };
