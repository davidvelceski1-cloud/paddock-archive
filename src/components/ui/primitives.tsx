import Link from "next/link";
import type { ReactNode } from "react";
import { ChevronRight, Sparkles } from "lucide-react";
import type { ClassFamily } from "@/data/schema";
import { cn } from "@/lib/utils";

export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("mx-auto w-full max-w-6xl px-4 sm:px-6", className)}>{children}</div>;
}

export function Section({ title, kicker, action, children, className, id }: { title: ReactNode; kicker?: ReactNode; action?: ReactNode; children: ReactNode; className?: string; id?: string }) {
  return (
    <section id={id} className={cn("mt-14 scroll-mt-24", className)} aria-labelledby={id ? `${id}-h` : undefined}>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          {kicker && <p className="mb-1 text-xs font-medium uppercase tracking-[0.12em] text-muted-strong">{kicker}</p>}
          <h2 id={id ? `${id}-h` : undefined} className="text-xl font-semibold tracking-tight">
            {title}
          </h2>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

export function PageHeader({ kicker, title, children, actions }: { kicker?: ReactNode; title: ReactNode; children?: ReactNode; actions?: ReactNode }) {
  return (
    <header className="rise">
      {kicker && <div className="mb-3 flex flex-wrap items-center gap-2">{kicker}</div>}
      <h1 className="display text-4xl sm:text-5xl">{title}</h1>
      {children && <div className="mt-4 max-w-2xl text-[17px] leading-relaxed text-body">{children}</div>}
      {actions && <div className="mt-5 flex flex-wrap items-center gap-2">{actions}</div>}
    </header>
  );
}

export function Chip({ active, href, children, className }: { active?: boolean; href: string; children: ReactNode; className?: string }) {
  return (
    <Link
      href={href}
      scroll={false}
      aria-current={active ? "true" : undefined}
      className={cn(
        "inline-flex shrink-0 items-center rounded-full border px-3 py-1 text-sm transition-colors duration-150",
        active ? "border-ink bg-ink text-[var(--bg)]" : "border-line bg-surface text-body hover:border-line-strong hover:text-ink",
        className,
      )}
    >
      {children}
    </Link>
  );
}

export function Badge({ children, tone = "neutral", className }: { children: ReactNode; tone?: "neutral" | "accent" | "warn"; className?: string }) {
  const tones = {
    neutral: "border-line bg-surface-2 text-body",
    accent: "border-accent/25 bg-accent-soft text-accent-ink",
    warn: "border-[var(--gt-bar)]/50 bg-[var(--gt-bg)] text-[var(--gt-ink)]",
  };
  return <span className={cn("inline-flex w-fit items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium", tones[tone], className)}>{children}</span>;
}

const FAMILY_VARS: Record<ClassFamily, string> = { hyper: "hyper", lmp1: "lmp1", lmp2: "lmp2", gt: "gt", hist: "hist" };

/** Small racing-class badge in the class's muted pastel. */
export function ClassBadge({ family, children, className }: { family: ClassFamily; children: ReactNode; className?: string }) {
  const v = FAMILY_VARS[family];
  return (
    <span
      className={cn("inline-flex w-fit shrink-0 items-center rounded-full px-2 py-0.5 text-[11px] font-semibold tracking-wide", className)}
      style={{ background: `var(--${v}-bg)`, color: `var(--${v}-ink)` }}
    >
      {children}
    </span>
  );
}

export function StatusBadge({ status, until }: { status: "active" | "defunct" | "retired"; until?: number | string | null }) {
  if (status === "active")
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-600/20 bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
        <span className="size-1.5 rounded-full bg-emerald-500" aria-hidden />
        Active
      </span>
    );
  return (
    <span className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border border-line bg-surface-2 px-2.5 py-0.5 text-xs font-medium text-muted-strong">
      <span className="size-1.5 rounded-full bg-muted" aria-hidden />
      {status === "defunct" ? `Defunct${until ? ` · ${until}` : ""}` : "Not racing in WEC"}
    </span>
  );
}

export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6 text-sm">
      <ol className="flex flex-wrap items-center gap-1 text-muted-strong">
        {items.map((it, i) => (
          <li key={i} className="flex items-center gap-1">
            {i > 0 && <ChevronRight className="size-3.5 text-muted" strokeWidth={1.5} aria-hidden />}
            {it.href ? (
              <Link href={it.href} className="transition-colors hover:text-ink">
                {it.label}
              </Link>
            ) : (
              <span aria-current="page" className="text-ink">
                {it.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/** Clearly labels machine-generated content. */
export function AiLabel({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full border border-accent/25 bg-accent-soft px-2 py-0.5 text-[11px] font-medium text-accent-ink", className)}>
      <Sparkles className="size-3" strokeWidth={1.5} aria-hidden /> AI-generated
    </span>
  );
}

export function StatTile({ label, value, note, href }: { label: string; value: ReactNode; note?: string; href?: string }) {
  const body = (
    <>
      <p className="tnum text-3xl font-semibold tracking-tight text-ink">{value}</p>
      <p className="mt-1 text-sm text-body">{label}</p>
      {note && <p className="mt-0.5 text-xs text-muted-strong">{note}</p>}
    </>
  );
  return href ? (
    <Link href={href} className="card card-link block p-4">
      {body}
    </Link>
  ) : (
    <div className="card p-4">{body}</div>
  );
}

/** Friendly empty state with a small line illustration. */
export function EmptyState({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="card flex flex-col items-center px-6 py-10 text-center">
      <svg width="88" height="40" viewBox="0 0 88 40" fill="none" aria-hidden className="mb-4 text-muted">
        <path d="M4 30c10 0 12-18 26-18s14 18 28 18 14-10 26-10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="3 5" />
        <circle cx="84" cy="20" r="3" fill="var(--accent-3)" />
        <path d="M4 36h80" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity=".5" />
      </svg>
      <p className="font-medium text-ink">{title}</p>
      {children && <div className="mt-1 max-w-md text-sm text-body">{children}</div>}
    </div>
  );
}

/** Shown on every page whose records come from the placeholder seed. */
export function PlaceholderNotice({ className }: { className?: string }) {
  return (
    <p className={cn("inline-flex items-center gap-1.5 rounded-full border border-[var(--gt-bar)]/50 bg-[var(--gt-bg)] px-2.5 py-0.5 text-xs font-medium text-[var(--gt-ink)]", className)}>
      <span className="size-1.5 rounded-full bg-[var(--gt-bar)]" aria-hidden />
      Placeholder data · pending verification
    </p>
  );
}
