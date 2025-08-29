import { Grid12, Span } from '@/components/layout/Grid12';
import ContainerWide from '@/components/layout/ContainerWide';
import ContainerRow from '@/components/layout/ContainerRow';
import SectionBand from '@/components/layout/SectionBand';

export default function WorkIndexExample() {
  return (
    <main className="z-content">
      <SectionBand>
        <ContainerWide>
          <Grid12 className="gutter" data-reveal-stagger>
            <Span cols={8}>
              <h1 className="text-5xl md:text-6xl font-semibold max-w-full">Selected work</h1>
            </Span>
            <Span cols={4}>
              <p>Exploratory projects across verticals, focusing on measurable aerodynamic gains.</p>
            </Span>
          </Grid12>
        </ContainerWide>
      </SectionBand>
      <SectionBand>
        <ContainerRow>
          <div className="auto-grid" data-reveal-stagger>
            {['IKEA UK', 'F1 Winglets', 'Rotorcraft Fairing', 'EV Diffuser'].map((t) => (
              <article key={t} className="sheen-card p-6" data-reveal>
                <h3 className="text-xl uc mb-3">{t}</h3>
                <p>Summary of the case study.</p>
              </article>
            ))}
          </div>
        </ContainerRow>
      </SectionBand>
    </main>
  );
}
