import ContainerRow from '@/components/layout/ContainerRow';
import { Grid12, Span } from '@/components/layout/Grid12';

export default function Page() {
  return (
    <section className='grid-shell section-band pt-28'>
      <ContainerRow>
        <Grid12 data-reveal-blur-stagger>
          <Span cols={8}><h1 className='text-4xl md:text-5xl font-light'>Industries</h1></Span>
          <Span cols={8}><p className='mt-6 text-white/70'>Civil aviation (fixed-wing and rotorcraft), defence-adjacent platforms via approved channels, UAV/RPAS, and motorsport applications demanding low mass, high rigidity, and optical discipline.</p></Span>
        </Grid12>
      </ContainerRow>
    </section>
  );
}
