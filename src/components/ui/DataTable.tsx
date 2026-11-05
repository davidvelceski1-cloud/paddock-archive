"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Sortable table with a sticky header and a pinned first column on narrow screens.
 * Rows are plain data so server components can pass them in.
 */
export type Cell = { v: string | number | null; href?: string; sort?: string | number; sub?: string; links?: { label: string; href?: string }[] };
export type Column = { key: string; label: string; numeric?: boolean; sortable?: boolean; className?: string };

export function DataTable({ columns, rows, caption, initialSort, dense }: { columns: Column[]; rows: Record<string, Cell>[]; caption: string; initialSort?: { key: string; dir: "asc" | "desc" }; dense?: boolean }) {
  const [sort, setSort] = useState(initialSort);
  const sorted = useMemo(() => {
    if (!sort) return rows;
    const val = (r: Record<string, Cell>) => r[sort.key]?.sort ?? r[sort.key]?.v ?? null;
    return [...rows].sort((a, b) => {
      const x = val(a);
      const y = val(b);
      if (x === y) return 0;
      if (x === null) return 1;
      if (y === null) return -1;
      const c = typeof x === "number" && typeof y === "number" ? x - y : String(x).localeCompare(String(y));
      return sort.dir === "asc" ? c : -c;
    });
  }, [rows, sort]);

  const toggle = (key: string, numeric?: boolean) =>
    setSort((s) => (s?.key === key ? { key, dir: s.dir === "asc" ? "desc" : "asc" } : { key, dir: numeric ? "desc" : "asc" }));

  return (
    <div className="card overflow-hidden">
      <div className="max-h-[70vh] overflow-auto">
        <table className="data-table w-full border-collapse text-sm">
          <caption className="sr-only">{caption}</caption>
          <thead>
            <tr className="border-b border-line">
              {columns.map((c, i) => {
                const active = sort?.key === c.key;
                const Icon = active ? (sort!.dir === "asc" ? ArrowUp : ArrowDown) : ArrowUpDown;
                return (
                  <th
                    key={c.key}
                    scope="col"
                    aria-sort={active ? (sort!.dir === "asc" ? "ascending" : "descending") : undefined}
                    className={cn("whitespace-nowrap px-4 py-2.5 text-left text-xs font-medium text-muted-strong", c.numeric && "text-right", i === 0 && "pin", c.className)}
                  >
                    {c.sortable === false ? (
                      c.label
                    ) : (
                      <button type="button" onClick={() => toggle(c.key, c.numeric)} className={cn("inline-flex items-center gap-1 rounded hover:text-ink", c.numeric && "flex-row-reverse", active && "text-ink")}>
                        {c.label}
                        <Icon className="size-3" strokeWidth={1.5} aria-hidden />
                      </button>
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {sorted.map((r, ri) => (
              <tr key={ri} className="border-b border-line last:border-0">
                {columns.map((c, i) => {
                  const cell = r[c.key];
                  return (
                    <td key={c.key} className={cn("px-4 align-top text-body transition-colors duration-150", dense ? "py-2" : "py-3", c.numeric && "tnum text-right", i === 0 && "pin font-medium text-ink", c.className)}>
                      <CellBody cell={cell} />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CellBody({ cell }: { cell?: Cell }) {
  if (!cell || cell.v === null || cell.v === "") return <span className="text-muted">—</span>;
  const main = cell.links ? (
    <span>
      {cell.links.map((l, i) => (
        <span key={i}>
          {i > 0 && ", "}
          {l.href ? (
            <Link href={l.href} className="text-ink underline decoration-line-strong underline-offset-2 hover:decoration-accent">
              {l.label}
            </Link>
          ) : (
            l.label
          )}
        </span>
      ))}
    </span>
  ) : cell.href ? (
    <Link href={cell.href} className="text-ink underline decoration-line-strong underline-offset-2 hover:decoration-accent">
      {cell.v}
    </Link>
  ) : (
    <span>{cell.v}</span>
  );
  return (
    <>
      {main}
      {cell.sub && <span className="block text-xs text-muted-strong">{cell.sub}</span>}
    </>
  );
}
