import ContainerRow from '@/components/layout/ContainerRow';
import SectionBand from '@/components/layout/SectionBand';
import { Grid12, Span } from '@/components/layout/Grid12';

export default function Page(){
  return (
    <>
      {/* Hero section */}
      <SectionBand className="pt-28">
        <ContainerRow>
          <Grid12 data-reveal-blur-stagger>
            <Span cols={8}><h1 className="text-4xl font-light">Request a Quote</h1></Span>
          </Grid12>
        </ContainerRow>
      </SectionBand>

      {/* Placeholder for future contact form */}
      <SectionBand>
        <ContainerRow>
          <Grid12>
            <Span cols={8}>
              <p className="body text-white/70">Contact form coming soon. In the meantime, please reach out via email or WhatsApp.</p>
            </Span>
          </Grid12>
        </ContainerRow>
      </SectionBand>
    </>
  );
}
