import { Grid12, Span } from "@/components/layout/Grid12";
import ContainerWide from "@/components/layout/ContainerWide";
import ContainerRow from "@/components/layout/ContainerRow";
import SectionBand from "@/components/layout/SectionBand";

export default function BlogIndexExample() {
  return (
    <main className="z-content">
      <SectionBand>
        <ContainerWide>
          <Grid12 className="gutter" data-reveal-stagger>
            <Span cols={8}>
              <h1 className="text-5xl md:text-6xl font-semibold max-w-full">
                Insights
              </h1>
            </Span>
            <Span cols={4}>
              <p>
                Latest writing on aero simulations, composites, and
                manufacturing.
              </p>
            </Span>
          </Grid12>
        </ContainerWide>
      </SectionBand>
      <SectionBand>
        <ContainerRow>
          <div className="auto-grid" data-reveal-stagger>
            {["Reading the wind", "CFD pitfalls", "Tunnel correlation"].map(
              (t) => (
                <article key={t} className="sheen-card p-6" data-reveal>
                  <h3 className="text-xl uc mb-3">{t}</h3>
                  <p>Post summary.</p>
                </article>
              ),
            )}
          </div>
        </ContainerRow>
      </SectionBand>
    </main>
  );
}
