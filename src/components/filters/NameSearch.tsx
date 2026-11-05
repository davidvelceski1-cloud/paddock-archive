"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Search } from "lucide-react";

/** Instant name search that writes ?q= into the URL (debounced), keeping other filters. */
export function NameSearch({ placeholder }: { placeholder: string }) {
  const sp = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [q, setQ] = useState(sp.get("q") ?? "");
  useEffect(() => setQ(sp.get("q") ?? ""), [sp]);
  useEffect(() => {
    if ((sp.get("q") ?? "") === q.trim()) return;
    const t = setTimeout(() => {
      const next = new URLSearchParams(sp);
      if (q.trim()) next.set("q", q.trim());
      else next.delete("q");
      next.delete("page");
      router.replace(`${pathname}${next.size ? `?${next}` : ""}`, { scroll: false });
    }, 200);
    return () => clearTimeout(t);
  }, [q, sp, pathname, router]);
  return (
    <label className="flex items-center gap-2 rounded-xl border border-line bg-surface px-3 shadow-card focus-within:border-accent/60">
      <Search className="size-4 text-muted-strong" strokeWidth={1.5} aria-hidden />
      <span className="sr-only">Search by name</span>
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={placeholder} className="h-10 w-full bg-transparent text-sm text-ink outline-none placeholder:text-muted-strong" />
    </label>
  );
}
