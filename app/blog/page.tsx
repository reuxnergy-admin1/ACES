import ContainerWide from '@/components/layout/ContainerWide';
import SectionBand from '@/components/layout/SectionBand';
import { Grid12, Span } from '@/components/layout/Grid12';

export default function Page(){
  return (
    <SectionBand className="!pt-[113px] sm:!pt-[120px] lg:!pt-[126px] theme-invert">
      <ContainerWide>
        <Grid12 data-reveal-blur-stagger>
          <Span cols={12} className="text-right md:text-left"><h1 className="text-4xl font-light">INSIGHTS</h1></Span>
        </Grid12>
      </ContainerWide>
    </SectionBand>
  );
}
