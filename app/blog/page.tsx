import ContainerWide from '@/components/layout/ContainerWide';
import SectionBand from '@/components/layout/SectionBand';
import { Grid12, Span } from '@/components/layout/Grid12';

export default function Page(){
  return (
    <SectionBand className="!pt-[180px] sm:!pt-[200px] lg:!pt-[220px] theme-invert">
      <ContainerWide>
        <Grid12 data-reveal-blur-stagger>
          <Span cols={8}><h1 className="text-4xl md:text-5xl font-light">INSIGHTS</h1></Span>
        </Grid12>
      </ContainerWide>
    </SectionBand>
  );
}
