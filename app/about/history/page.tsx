import ContainerRow from '@/components/layout/ContainerRow';
import { Grid12, Span } from '@/components/layout/Grid12';

export default function Page() {
  return (
    <section className='grid-shell section-band pt-28'>
      <ContainerRow>
        <Grid12 data-reveal-blur-stagger>
          <Span cols={8}><h1 className='text-4xl md:text-5xl font-light'>History</h1></Span>
          <Span cols={8}><p className='mt-6 text-white/70'>From Aces Plastics to ACES Aerodynamics, we’ve evolved from precision plastics to a SACAA-approved fabrication facility (MP39). Our roots in aerospace and motorsport set our standard: robust engineering discipline applied to every transparency and composite we ship.</p></Span>
        </Grid12>
      </ContainerRow>
    </section>
  );
}
