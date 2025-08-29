import ContainerRow from '@/components/layout/ContainerRow';
import { Grid12, Span } from '@/components/layout/Grid12';

export default function Page() {
  return (
    <section className="grid-shell section-band pt-28">
      <ContainerRow>
        <Grid12 data-reveal-blur-stagger>
          <Span cols={8}>
            <div className="prose prose-invert">
              <h1>Cookies</h1>
              <p>By default, this site does not set tracking cookies. If analytics are enabled in future, we will present an explicit opt-in banner.</p>
            </div>
          </Span>
        </Grid12>
      </ContainerRow>
    </section>
  );
}
