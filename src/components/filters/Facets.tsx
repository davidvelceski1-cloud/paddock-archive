import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { toParams, type Filters } from "@/lib/search/filters";
import { cn } from "@/lib/utils";

export type Facet = { label: string; key: keyof Filters; options: { value: string | number | boolean | undefined; label: string }[] };

const link = (base: string, f: Filters) => {
  const p = toParams(f).toString();
  return `${base}${p ? `?${p}` : ""}`;
};

/** Structured filter rows; each option is a link, so every state is a shareable URL. */
export function Facets({ facets, filters, basePath }: { facets: Facet[]; filters: Filters; basePath: string }) {
  return (
    <div className="space-y-2">
      {facets.map((fc) => (
        <div key={fc.key} className="flex items-center gap-3" role="group" aria-label={fc.label}>
          <span className="w-24 shrink-0 text-xs font-medium uppercase tracking-[0.1em] text-muted-strong">{fc.label}</span>
          <div className="no-scrollbar flex min-w-0 gap-1.5 overflow-x-auto py-0.5">
            {fc.options.map((o) => {
              const active = filters[fc.key] === o.value || (o.value === undefined && filters[fc.key] === undefined);
              return (
                <Link
                  key={String(o.value)}
                  href={link(basePath, { ...filters, [fc.key]: o.value })}
                  scroll={false}
                  aria-current={active ? "true" : undefined}
                  className={cn(
                    "shrink-0 rounded-full border px-2.5 py-0.5 text-[13px] transition-colors duration-150",
                    active ? "border-ink bg-ink text-[var(--bg)]" : "border-line bg-surface text-body hover:border-line-strong hover:text-ink",
                  )}
                >
                  {o.label}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

export function SortLinks({ options, filters, basePath }: { options: { value: string; label: string }[]; filters: Filters; basePath: string }) {
  const current = filters.sort ?? options[0].value;
  return (
    <div className="flex items-center gap-1 text-sm" role="group" aria-label="Sort">
      <span className="mr-1 text-muted-strong">Sort</span>
      {options.map((o) => (
        <Link
          key={o.value}
          href={link(basePath, { ...filters, sort: o.value === options[0].value ? undefined : o.value })}
          scroll={false}
          aria-current={current === o.value ? "true" : undefined}
          className={cn("rounded-md px-2 py-1 transition-colors", current === o.value ? "bg-surface-2 text-ink" : "text-body hover:text-ink")}
        >
          {o.label}
        </Link>
      ))}
    </div>
  );
}

/** Simple page navigation that keeps the active filters in the URL. */
export function Pager({ page, pages, filters, basePath }: { page: number; pages: number; filters: Filters; basePath: string }) {
  if (pages <= 1) return null;
  const at = (p: number) => {
    const sp = toParams(filters);
    if (p > 1) sp.set("page", String(p));
    const s = sp.toString();
    return `${basePath}${s ? `?${s}` : ""}`;
  };
  return (
    <nav aria-label="Pagination" className="mt-8 flex items-center justify-center gap-2 text-sm">
      {page > 1 ? (
        <Link href={at(page - 1)} className="inline-flex items-center gap-1 rounded-full border border-line px-3 py-1.5 text-body hover:text-ink">
          <ChevronLeft className="size-4" strokeWidth={1.5} aria-hidden /> Previous
        </Link>
      ) : null}
      <span className="tnum px-2 text-muted-strong">
        Page {page} of {pages}
      </span>
      {page < pages ? (
        <Link href={at(page + 1)} className="inline-flex items-center gap-1 rounded-full border border-line px-3 py-1.5 text-body hover:text-ink">
          Next <ChevronRight className="size-4" strokeWidth={1.5} aria-hidden />
        </Link>
      ) : null}
    </nav>
  );
}

export const paginate = <T,>(rows: T[], pageParam: string | string[] | undefined, size = 24) => {
  const pages = Math.max(1, Math.ceil(rows.length / size));
  const page = Math.min(pages, Math.max(1, Number(Array.isArray(pageParam) ? pageParam[0] : pageParam) || 1));
  return { page, pages, rows: rows.slice((page - 1) * size, page * size) };
};
