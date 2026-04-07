import { Grid12, Span } from "@/components/layout/Grid12";
import ContainerWide from "@/components/layout/ContainerWide";
import ContainerRow from "@/components/layout/ContainerRow";
import SectionBand from "@/components/layout/SectionBand";

export default function CareersExample() {
  return (
    <main className="z-content">
      <SectionBand>
        <ContainerWide>
          <Grid12 className="gutter" data-reveal-stagger>
            <Span cols={8}>
              <h1 className="text-5xl md:text-6xl font-semibold max-w-full">
                Careers
              </h1>
            </Span>
            <Span cols={4}>
              <p>We hire builders and tinkerers. Browse open roles.</p>
            </Span>
          </Grid12>
        </ContainerWide>
      </SectionBand>
      <SectionBand>
        <ContainerRow>
          <div
            className="auto-grid"
            style={{ ["--auto-grid-min" as unknown as never]: undefined }}
            data-reveal-stagger
          >
            {["Aero Engineer", "Composites Technician", "Test Engineer"].map(
              (r) => (
                <button
                  key={r}
                  type="button"
                  className="sheen-card p-6 text-left"
                  aria-label={`Open role: ${r}`}
                  data-reveal
                >
                  <h3 className="text-xl uc mb-3">{r}</h3>
                  <p>Learn more</p>
                </button>
              ),
            )}
          </div>
        </ContainerRow>
      </SectionBand>
    </main>
  );
}
