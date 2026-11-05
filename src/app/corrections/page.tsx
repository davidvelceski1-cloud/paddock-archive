import type { Metadata } from "next";
import { Suspense } from "react";
import { Container, PageHeader } from "@/components/ui/primitives";
import { CorrectionForm } from "@/components/archive/CorrectionForm";

export const metadata: Metadata = { title: "Report a correction", description: "Help keep the archive accurate." };

export default function CorrectionsPage() {
  return (
    <Container className="pt-12">
      <div className="mx-auto max-w-xl">
        <PageHeader title="Report a correction">
          The archive&apos;s records are seed data pending verification, so corrections are especially welcome. Please include a source — an official classification, a timing sheet or a reputable publication.
        </PageHeader>
        <Suspense>
          <CorrectionForm />
        </Suspense>
      </div>
    </Container>
  );
}
