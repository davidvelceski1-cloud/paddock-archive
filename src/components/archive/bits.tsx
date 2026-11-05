import Link from "next/link";
import { ArrowUpRight, BookOpen, Calendar, Car, Factory, Flag, MessageSquareWarning, User } from "lucide-react";
import ReactMarkdown from "react-markdown";
import type { ClassId, EntryRef } from "@/data/schema";
import { classFamily, ix, resolveCar, resolveDriver, resolveTeam, type Resolved } from "@/lib/archive/data";
import { related, type RelatedKind } from "@/lib/archive/related";
import { ClassBadge, Section } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";

/** A name that links when the entity is profiled, plain text otherwise. */
export function Ref({ r, className }: { r: Resolved; className?: string }) {
  return r.href ? (
    <Link href={r.href} className={cn("text-ink underline decoration-line-strong underline-offset-2 transition-colors hover:decoration-accent", className)}>
      {r.label}
    </Link>
  ) : (
    <span className={cn("text-ink", className)}>{r.label}</span>
  );
}

export function Refs({ items }: { items: Resolved[] }) {
  return (
    <>
      {items.map((r, i) => (
        <span key={i}>
          {i > 0 && (i === items.length - 1 ? " and " : ", ")}
          <Ref r={r} />
        </span>
      ))}
    </>
  );
}

export function ClassTag({ id, className }: { id: ClassId; className?: string }) {
  const c = ix().classes.get(id);
  return (
    <ClassBadge family={classFamily(id)} className={className}>
      {c?.short ?? id}
    </ClassBadge>
  );
}

/** "#7 Toyota Gazoo Racing · Toyota TS050 Hybrid — Conway, Kobayashi and López" */
export function Crew({ e, season, compact }: { e: EntryRef; season?: number; compact?: boolean }) {
  return (
    <span>
      {e.number && <span className="tnum mr-1 text-muted-strong">#{e.number}</span>}
      <Ref r={resolveTeam(e.team, season)} />
      {!compact && (
        <span className="text-muted-strong">
          {" · "}
          <Ref r={resolveCar(e.car)} className="text-body" />
        </span>
      )}
      {e.drivers.length > 0 && (
        <span className="block text-sm text-body">
          <Refs items={e.drivers.map(resolveDriver)} />
        </span>
      )}
    </span>
  );
}

/** Markdown with internal links (editorial copy). */
export function RichText({ md, className }: { md: string; className?: string }) {
  return (
    <div className={cn("prose-archive text-[16px] text-body", className)}>
      <ReactMarkdown components={{ a: ({ href, children }) => (href?.startsWith("/") ? <Link href={href}>{children}</Link> : <a href={href} rel="noreferrer">{children}</a>) }}>{md}</ReactMarkdown>
    </div>
  );
}

/** Every page lists its sources and offers a correction link. */
export function SourcesSection({ ids, page }: { ids: string[]; page: string }) {
  const sources = [...new Set(ids)].map((id) => ix().sources.get(id)).filter((s) => !!s);
  return (
    <Section title="Sources" kicker="Traceability" id="sources">
      <div className="card divide-y divide-line">
        {sources.map((s) => (
          <div key={s.id} className="flex flex-wrap items-start justify-between gap-2 px-5 py-3.5 text-sm">
            <div>
              <p className="font-medium text-ink">
                {s.title} <span className="font-normal text-muted-strong">· {s.publisher}</span>
              </p>
              {s.note && <p className="mt-0.5 text-body">{s.note}</p>}
            </div>
            {s.url && (
              <a href={s.url} rel="noreferrer" target="_blank" className="inline-flex items-center gap-1 text-accent-ink hover:underline">
                Visit <ArrowUpRight className="size-3.5" strokeWidth={1.5} aria-hidden />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            )}
          </div>
        ))}
        <div className="flex flex-wrap items-center justify-between gap-2 bg-surface-2/60 px-5 py-3 text-sm">
          <span className="text-body">Spotted a mistake or have a better source?</span>
          <Link href={`/corrections?page=${encodeURIComponent(page)}`} className="inline-flex items-center gap-1.5 font-medium text-ink hover:underline">
            <MessageSquareWarning className="size-4" strokeWidth={1.5} aria-hidden /> Report a correction
          </Link>
        </div>
      </div>
    </Section>
  );
}

const KIND_ICON: Record<RelatedKind, typeof Flag> = { team: Flag, driver: User, season: Calendar, car: Car, story: BookOpen, manufacturer: Factory };

/** "Related" rail ranked by relevance (shared seasons, teammates, rivals, titles). */
export function RelatedRail({ entityKey }: { entityKey: string }) {
  const items = related(entityKey);
  if (!items.length) return null;
  return (
    <Section title="Related" kicker="Keep exploring" id="related">
      <ul className="no-scrollbar -mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-4">
        {items.map((r) => {
          const Icon = KIND_ICON[r.kind];
          return (
            <li key={r.key} className="w-60 shrink-0 snap-start sm:w-auto">
              <Link href={r.href} className="card card-link flex h-full items-start gap-3 p-4">
                <span className="mt-0.5 rounded-lg bg-surface-2 p-1.5 text-muted-strong">
                  <Icon className="size-4" strokeWidth={1.5} aria-hidden />
                </span>
                <span className="min-w-0">
                  <span className="block truncate font-medium text-ink">{r.label}</span>
                  <span className="block text-xs text-muted-strong">{r.reason}</span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
