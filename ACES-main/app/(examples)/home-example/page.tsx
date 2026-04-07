import { Grid12, Span } from "@/components/layout/Grid12";
import ContainerWide from "@/components/layout/ContainerWide";
import ContainerRow from "@/components/layout/ContainerRow";
import SectionBand from "@/components/layout/SectionBand";
import Prose from "@/components/layout/Prose";
import Image from "next/image";

export default function HomeExample() {
  return (
    <main className="z-content">
      <SectionBand>
        <ContainerWide>
          <Grid12 className="gutter" data-reveal-stagger>
            <Span cols={8}>
              <h1 className="text-5xl md:text-7xl font-semibold max-w-full">
                Engineering aerodynamic performance for aircraft, helicopters,
                and motorsport.
              </h1>
            </Span>
            <Span cols={4}>
              <Prose>
                <p>
                  We design and manufacture advanced aerodynamic solutions. Our
                  process blends simulation, wind tunnel testing, and on-track
                  telemetry.
                </p>
              </Prose>
            </Span>
          </Grid12>
        </ContainerWide>
      </SectionBand>

      <SectionBand>
        <ContainerRow>
          <div className="auto-grid" data-reveal-stagger>
            {[
              { id: "c1", title: "Case 1" },
              { id: "c2", title: "Case 2" },
              { id: "c3", title: "Case 3" },
              { id: "c4", title: "Case 4" },
              { id: "c5", title: "Case 5" },
              { id: "c6", title: "Case 6" },
            ].map((card) => (
              <article key={card.id} className="sheen-card p-6" data-reveal>
                <h3 className="text-xl uc mb-3">{card.title}</h3>
                <p>Short description showing card layout and spacing rhythm.</p>
              </article>
            ))}
          </div>
        </ContainerRow>
      </SectionBand>

      <figure className="full-bleed">
        <Image
          src="/contours.svg"
          alt="Decorative contours"
          width={1920}
          height={600}
          priority
          style={{ width: "100%", height: "auto" }}
        />
      </figure>
    </main>
  );
}
