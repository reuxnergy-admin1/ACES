import ContainerRow from '@/components/layout/ContainerRow';
import { Grid12, Span } from '@/components/layout/Grid12';

export default function Page() {
  return (
    <section className="grid-shell section-band pt-28">
      <ContainerRow>
        <Grid12 data-reveal-blur-stagger>
          <Span cols={8}><h1 className="text-4xl md:text-5xl font-light">Services</h1></Span>
        </Grid12>
      </ContainerRow>
      <ContainerRow className="mt-6">
        <Grid12 data-reveal-blur-stagger>
          <Span cols={6}><div className="body list-disc list-inside text-white/70"><li>Design for manufacturability</li></div></Span>
          <Span cols={6}><div className="body list-disc list-inside text-white/70"><li>Tooling (CNC patterns, matched dies)</li></div></Span>
          <Span cols={6}><div className="body list-disc list-inside text-white/70"><li>Thermoforming & annealing</li></div></Span>
          <Span cols={6}><div className="body list-disc list-inside text-white/70"><li>Edge finishing & drilling</li></div></Span>
          <Span cols={6}><div className="body list-disc list-inside text-white/70"><li>Coatings (scratch-resistant / anti-fog via approved processes)</li></div></Span>
          <Span cols={6}><div className="body list-disc list-inside text-white/70"><li>Quality assurance & documentation</li></div></Span>
        </Grid12>
      </ContainerRow>
    </section>
  );
}
