import ContainerRow from "@/components/layout/ContainerRow";
import { Grid12, Span } from "@/components/layout/Grid12";

export default function Page() {
  return (
    <section className="grid-shell section-band pt-28">
      <ContainerRow>
        <Grid12 data-reveal-blur-stagger>
          <Span cols={8}>
            <h1 className="text-4xl md:text-5xl font-light">Philosophy</h1>
          </Span>
          <Span cols={8}>
            <p className="mt-6 body text-white/70 max-w-reading">
              Precision, reliability, aspiration. We design for maintainability
              and lifecycle value: stable optical clarity, robust mounting
              interfaces, and service-friendly finishing. Technology is chosen
              for fitness-to-purpose, not fashion.
            </p>
          </Span>
        </Grid12>
      </ContainerRow>
    </section>
  );
}
