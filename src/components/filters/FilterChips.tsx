import Link from "next/link";
import { X } from "lucide-react";
import { chips, toParams, type Filters, type Scope } from "@/lib/search/filters";

/** Applied filters as removable chips; every state is a shareable URL. */
export function FilterChips({ filters, scope, basePath, count, total }: { filters: Filters; scope: Scope; basePath: string; count: number; total: number }) {
  const list = chips(filters, scope);
  return (
    <div className="flex flex-wrap items-center gap-2" aria-live="polite">
      <p className="tnum text-sm text-muted-strong">
        {count === total ? `${total} ${scope}` : `${count} of ${total} ${scope}`}
      </p>
      {list.map((c) => {
        const next = toParams({ ...filters, [c.key]: undefined }).toString();
        return (
          <Link
            key={c.key}
            href={`${basePath}${next ? `?${next}` : ""}`}
            scroll={false}
            className="group inline-flex items-center gap-1 rounded-full border border-accent/30 bg-accent-soft py-1 pl-3 pr-2 text-xs font-medium text-accent-ink transition-colors hover:border-accent"
            aria-label={`Remove filter: ${c.label}`}
          >
            {c.label}
            <X className="size-3 opacity-70 group-hover:opacity-100" strokeWidth={2} aria-hidden />
          </Link>
        );
      })}
      {list.length > 1 && (
        <Link href={basePath} scroll={false} className="text-xs text-muted-strong underline-offset-2 hover:text-ink hover:underline">
          Clear all
        </Link>
      )}
    </div>
  );
}
