import ContainerWide from '@/components/layout/ContainerWide';
import SectionBand from '@/components/layout/SectionBand';
import { Grid12, Span } from '@/components/layout/Grid12';

export default function Page(){
  return (
    <>
      <SectionBand className="!pt-[113px] sm:!pt-[120px] lg:!pt-[126px]">
        <ContainerWide>
          <Grid12 data-reveal-blur-stagger>
            <Span cols={12} className="text-right md:text-left"><h1 className="text-4xl font-light">INSIGHTS</h1></Span>
          </Grid12>
        </ContainerWide>
      </SectionBand>

      <SectionBand>
        <ContainerWide>
          <Grid12 data-reveal-blur-stagger>
            <Span cols={12} className="md:col-span-6 lg:col-span-4">
              <article className="border border-white/10 rounded-2xl p-6 hover:border-white/30 transition-colors text-right md:text-left">
                <h2 className="text-xl font-medium mb-4">Article Title Coming Soon</h2>
                <div className="aspect-[4/3] bg-white/5 rounded-xl flex items-center justify-center mb-4">
                  <span className="text-white/30 text-sm uc tracking-wider">Image</span>
                </div>
                <p className="text-white/60 text-sm mb-3">
                  Introductory text for the upcoming article will appear here.
                </p>
                <div className="text-white/40 text-xs">
                  Coming Soon
                </div>
              </article>
            </Span>
          </Grid12>
        </ContainerWide>
      </SectionBand>
    </>
  );
}
