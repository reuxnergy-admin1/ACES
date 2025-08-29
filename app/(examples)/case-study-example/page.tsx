import { Grid12, Span } from '@/components/layout/Grid12';
import ContainerWide from '@/components/layout/ContainerWide';
import ContainerRow from '@/components/layout/ContainerRow';
import SectionBand from '@/components/layout/SectionBand';
import Prose from '@/components/layout/Prose';

export default function CaseStudyExample() {
  return (
    <main className="z-content">
      <SectionBand>
        <ContainerWide>
          <Grid12 className="gutter" data-reveal-stagger>
            <Span cols={8}>
              <h1 className="text-5xl md:text-6xl font-semibold max-w-full">IKEA UK — aerodynamic packaging optimization</h1>
            </Span>
            <Span cols={4}>
              <Prose>
                <p>We partnered to reduce drag in transport packaging, yielding 8% logistics efficiency gains.</p>
              </Prose>
            </Span>
          </Grid12>
        </ContainerWide>
      </SectionBand>
      <SectionBand>
        <ContainerRow>
          <Prose data-reveal>
            <p>Longform content constrained to reading width. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus lacinia metus sed mi placerat gravida.</p>
          </Prose>
        </ContainerRow>
      </SectionBand>
    </main>
  );
}
