import ContainerWide from "@/components/layout/ContainerWide";
import SectionBand from "@/components/layout/SectionBand";
import { Grid12, Span } from "@/components/layout/Grid12";

export default function Page() {
  return (
    <>
      <SectionBand className="!pt-[140px] sm:!pt-[150px] lg:!pt-[160px]">
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
              <article className="border border-white/10 rounded-2xl p-6 hover:border-white/30 transition-colors text-center md:text-left">
                <h2 className="text-xl font-medium mb-1 text-white">
                  Article Title Coming Soon
                </h2>
                <div className="text-white/55 text-xs mb-4">Coming Soon</div>
                <div className="aspect-[4/3] bg-white/10 rounded-xl flex items-center justify-center mb-4 border border-white/10">
                  <span className="text-white/55 text-sm uc tracking-wider">
                    Image
                  </span>
                </div>
                <p className="text-white/70 text-sm">
                  Introductory text for the upcoming article will appear here.
                </p>
              </article>
            </Span>
          </Grid12>

          {/* Centered Request a Quote button */}
          <div className="mt-12 flex justify-center">
            <a
              href="https://staging-aces.netlify.app/contact/"
              className="button-primary h-11 px-6 whitespace-nowrap"
            >
              <span aria-hidden="true" className="reveal-line h top" />
              <span aria-hidden="true" className="reveal-line h bottom" />
              <span aria-hidden="true" className="reveal-line v left" />
              <span aria-hidden="true" className="reveal-line v right" />
              <span className="sr-only">Request a Quote</span>
              <span aria-hidden="true">Request a Quote</span>
            </a>
          </div>
        </ContainerWide>
      </SectionBand>
    </>
  );
}
