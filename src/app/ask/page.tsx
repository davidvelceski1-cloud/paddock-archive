import type { Metadata } from "next";
import { Container } from "@/components/ui/primitives";
import { AskChat } from "@/components/ask/AskChat";
import { AskContext } from "@/components/ask/AskContext";

export const metadata: Metadata = { title: "Ask the Archive", description: "Ask questions about endurance racing history and get answers grounded in the archive, with sources." };

export default function AskPage() {
  return (
    <Container className="pt-10">
      <AskContext kind="other" suggestions={[]} />
      <div className="mx-auto flex h-[calc(100vh-9rem)] max-w-3xl flex-col">
        <h1 className="sr-only">Ask the Archive</h1>
        <AskChat variant="page" />
      </div>
    </Container>
  );
}
