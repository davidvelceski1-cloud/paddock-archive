/** Accent-insensitive fuzzy scoring for the ⌘K palette. Higher is better; null = no match. */
export const norm = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();

export function fuzzyScore(query: string, label: string, extra = ""): number | null {
  const q = norm(query.trim());
  if (!q) return 0;
  const l = norm(label);
  const hay = `${l} ${norm(extra)}`;
  const words = q.split(/\s+/);
  // Every query word must match a word prefix, a substring, or (for longer words) a subsequence.
  let score = 0;
  for (const w of words) {
    if (hay.split(/[\s\-–·,]+/).some((p) => p.startsWith(w))) score += 30;
    else if (hay.includes(w)) score += 15;
    else if (w.length >= 3 && isSubsequence(w, l)) score += 4;
    else return null;
  }
  if (l.startsWith(q)) score += 40;
  if (l === q) score += 40;
  return score - l.length / 20;
}

function isSubsequence(needle: string, hay: string) {
  let i = 0;
  for (const ch of hay) if (ch === needle[i]) i++;
  return i === needle.length;
}
