import ContainerRow from "@/components/layout/ContainerRow";
import { Grid12, Span } from "@/components/layout/Grid12";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aircraft Transparencies",
  description:
    "SACAA-approved cast acrylic aircraft canopies, windscreens, and transparencies manufactured in Potchefstroom, South Africa. Custom and production parts for fixed-wing aircraft.",
};

export default function Page() {
  return (
    <section className="grid-shell section-band pt-28">
      <ContainerRow>
        <Grid12 data-reveal-blur-stagger>
          <Span cols={8}>
            <h1 className="text-4xl md:text-5xl font-light">Aircraft</h1>
          </Span>
          <Span cols={8}>
            <p className="mt-6 body text-white/70 max-w-reading">
              Placeholder catalogue and engineering notes for aircraft. Supply
              product IDs to enable ordering.
            </p>
          </Span>
        </Grid12>
      </ContainerRow>
    </section>
  );
}
