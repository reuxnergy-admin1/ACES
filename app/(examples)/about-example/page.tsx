import { Grid12, Span } from '@/components/layout/Grid12';
import ContainerWide from '@/components/layout/ContainerWide';
import ContainerRow from '@/components/layout/ContainerRow';
import SectionBand from '@/components/layout/SectionBand';
import Prose from '@/components/layout/Prose';

export default function AboutExample() {
  return (
    <main className="z-content">
      <SectionBand>
        <ContainerWide>
          <Grid12 className="gutter" data-reveal-stagger>
            <Span cols={8}><h1 className="text-5xl md:text-6xl font-semibold max-w-full">About ACES</h1></Span>
            <Span cols={4}><Prose><p>We are engineers obsessed with performance.</p></Prose></Span>
          </Grid12>
        </ContainerWide>
      </SectionBand>
      <SectionBand>
        <ContainerRow>
          <Prose data-reveal>
            <p>Founded in 2009, our team delivers aerodynamic innovation across sectors.</p>
          </Prose>
        </ContainerRow>
      </SectionBand>
    </main>
  );
}
