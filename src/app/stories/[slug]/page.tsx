import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Badge, Breadcrumbs, Container, PlaceholderNotice } from "@/components/ui/primitives";
import { RelatedRail, RichText, SourcesSection } from "@/components/archive/bits";
import { AskContext, AskPrompts } from "@/components/ask/AskContext";
import { archive, href, ix } from "@/lib/archive/data";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return archive().stories.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const s = ix().stories.get((await params).slug);
  return s ? { title: s.title, description: s.dek } : {};
}

export default async function StoryPage({ params }: { params: Params }) {
  const s = ix().stories.get((await params).slug);
  if (!s) notFound();
  const era = s.eraSlug ? ix().eras.get(s.eraSlug) : undefined;
  return (
    <Container className="pt-10">
      <AskContext kind="story" id={s.slug} label={s.title} suggestions={[`Tell me more about ${s.title.toLowerCase()}`]} />
      <Breadcrumbs items={[{ label: "Stories" }, { label: s.title }]} />
      <article className="mx-auto max-w-2xl">
        <header className="rise">
          <div className="mb-4 flex flex-wrap gap-2">
            {era && <Badge>{era.name}</Badge>}
            <PlaceholderNotice />
          </div>
          <h1 className="display text-4xl sm:text-5xl">{s.title}</h1>
          <p className="mt-4 text-xl leading-relaxed text-body">{s.dek}</p>
        </header>
        <RichText md={s.body} className="mt-10 text-[17px]" />
        <AskPrompts className="mt-10" prompts={[`Tell me more about ${s.title.toLowerCase()}`]} />
      </article>
      <RelatedRail entityKey={`story:${s.slug}`} />
      <SourcesSection ids={["seed-editorial", "fiawec-results", "aco-lemans"]} page={href.story(s.slug)} />
    </Container>
  );
}
