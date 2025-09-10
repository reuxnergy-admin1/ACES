import ContainerRow from '@/components/layout/ContainerRow';
import { Grid12, Span } from '@/components/layout/Grid12';

export default function Page() {
  return (
    <section className='grid-shell section-band pt-28'>
      <ContainerRow>
        <Grid12 data-reveal-blur-stagger>
          <Span cols={8}><h1 className='text-4xl md:text-5xl font-light'>Quality</h1></Span>
          <Span cols={8}><p className='mt-6 body text-white/70 max-w-reading'>Quality is engineered in, not inspected at the end. We operate to aviation-grade process control with documented traceability, optical inspection (VLT/defect mapping), and mechanical validation on representative coupons. Our goal: repeatable flight-worthy outcomes.</p></Span>
        </Grid12>
      </ContainerRow>
    </section>
  );
}
