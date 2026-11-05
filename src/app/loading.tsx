import { Container } from "@/components/ui/primitives";

export default function Loading() {
  return (
    <Container className="pt-12" aria-busy="true">
      <div className="skeleton h-4 w-40" />
      <div className="skeleton mt-4 h-12 w-2/3" />
      <div className="skeleton mt-4 h-4 w-1/2" />
      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="skeleton h-28" />
        ))}
      </div>
    </Container>
  );
}
