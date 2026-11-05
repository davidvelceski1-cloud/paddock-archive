"use client";

import { Container, EmptyState } from "@/components/ui/primitives";

export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return (
    <Container className="pt-20">
      <EmptyState title="Something went wrong loading this page">
        <button type="button" onClick={reset} className="mt-2 font-medium text-ink underline">
          Try again
        </button>
      </EmptyState>
    </Container>
  );
}
