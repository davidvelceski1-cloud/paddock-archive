import Link from "next/link";
import { Container, EmptyState } from "@/components/ui/primitives";

export default function NotFound() {
  return (
    <Container className="pt-20">
      <EmptyState title="This page isn't in the archive">
        It may not have been imported yet, or the link is wrong.{" "}
        <Link href="/" className="font-medium text-ink underline">
          Back to the start line
        </Link>
      </EmptyState>
    </Container>
  );
}
