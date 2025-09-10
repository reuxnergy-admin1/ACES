import ContainerRow from '@/components/layout/ContainerRow';
import { Grid12, Span } from '@/components/layout/Grid12';
import Prose from '@/components/layout/Prose';

export default function Page() {
  return (
    <section className="grid-shell section-band pt-28">
      <ContainerRow>
        <Grid12 data-reveal-blur-stagger>
          <Span cols={8}>
            <Prose className="prose prose-invert">
              <h1>Privacy</h1>
              <p>We collect only the information necessary to handle your enquiry or order. We do not sell or rent personal data. POPIA/GDPR requests: email <a className="link-underline" href="mailto:info@acesaerodynamics.com">info@acesaerodynamics.com</a>.</p>
            </Prose>
          </Span>
        </Grid12>
      </ContainerRow>
    </section>
  );
}
