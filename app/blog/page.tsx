import ContainerWide from '@/components/layout/ContainerWide';
import SectionBand from '@/components/layout/SectionBand';
import { Grid12, Span } from '@/components/layout/Grid12';

export default function Page(){
  return (
    <>
      <SectionBand className="!pt-[113px] sm:!pt-[120px] lg:!pt-[126px]">
        <ContainerWide>
          <Grid12>
            <Span cols={12} className="text-center md:text-left">
              <h1 className="text-4xl font-light text-white">INSIGHTS</h1>
            </Span>
          </Grid12>
        </ContainerWide>
      </SectionBand>

      <SectionBand>
        <ContainerWide>
          <Grid12>
            <Span cols={12} className="md:col-span-6 lg:col-span-4">
              <article className="border border-white/10 rounded-2xl p-6 hover:border-white/30 transition-colors text-right">
                <h2 className="text-xl font-medium mb-4 text-white">Article Title Coming Soon</h2>
                <div className="aspect-[4/3] bg-white/10 rounded-xl flex items-center justify-center mb-4 border border-white/10">
                  <span className="text-white/50 text-sm uc tracking-wider">Image</span>
                </div>
                <p className="text-white/70 text-sm mb-3">
                  Introductory text for the upcoming article will appear here.
                </p>
                <div className="text-white/50 text-xs">
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
