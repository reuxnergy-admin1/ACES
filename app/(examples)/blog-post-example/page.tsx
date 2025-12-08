import ContainerRow from "@/components/layout/ContainerRow";
import SectionBand from "@/components/layout/SectionBand";
import Prose from "@/components/layout/Prose";

export default function BlogPostExample() {
  return (
    <main className="z-content">
      <SectionBand>
        <ContainerRow data-reveal>
          <h1 className="text-5xl md:text-6xl font-semibold max-w-full">
            Reading the wind: correlating CFD to trackside data
          </h1>
        </ContainerRow>
      </SectionBand>
      <SectionBand>
        <ContainerRow>
          <Prose data-reveal>
            <p>
              Intro paragraph constrained to 60–72ch for optimal readability.
            </p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque
              feugiat leo nec neque porttitor, vel efficitur purus aliquet.
            </p>
            <h2 className="text-2xl uc mt-8">Method</h2>
            <p>
              We applied <em>k–epsilon</em> turbulence modeling and validated
              against telemetry.
            </p>
          </Prose>
        </ContainerRow>
      </SectionBand>
    </main>
  );
}
