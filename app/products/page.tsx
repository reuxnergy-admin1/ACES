import ContainerWide from '@/components/layout/ContainerWide';
import SectionBand from '@/components/layout/SectionBand';
import { Grid12, Span } from '@/components/layout/Grid12';
import Link from 'next/link';

export default function Page() {
  return (
    <>
      {/* Hero section */}
      <SectionBand className="!pt-[113px] sm:!pt-[120px] lg:!pt-[126px]">
        <ContainerWide>
          <Grid12 data-reveal-blur-stagger>
            <Span cols={12} className="text-center md:text-left"><h1 className="text-4xl font-light">PRODUCTS AND SERVICES</h1></Span>
          </Grid12>
        </ContainerWide>
      </SectionBand>

      {/* Product blocks */}
      <SectionBand>
        <ContainerWide>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-reveal-blur-stagger>
            {/* Aircraft Transparencies */}
            <div className="border border-white/10 rounded-2xl p-7 hover:border-white/30 transition-colors text-center md:text-left">
              <div className="text-xl font-medium mb-4">Aircraft Transparencies</div>
              <div className="text-white/60 space-y-1">
                <p>All Certified and Uncertified</p>
                <p>Unpressurised Aircraft Types</p>
                <p className="text-white/40 mt-2">Windows | Windshields | Side Windows</p>
              </div>
            </div>

            {/* Helicopter Transparencies */}
            <div className="border border-white/10 rounded-2xl p-7 hover:border-white/30 transition-colors text-center md:text-left">
              <div className="text-xl font-medium mb-4">Helicopter Transparencies</div>
              <div className="text-white/60 space-y-1">
                <p>All Certified and Uncertified</p>
                <p>Unpressurised Helicopter Types</p>
                <p className="text-white/40 mt-2">Canopy | Bubble | Side Windows</p>
              </div>
            </div>

            {/* Motorsport Components */}
            <div className="border border-white/10 rounded-2xl p-7 hover:border-white/30 transition-colors text-center md:text-left">
              <div className="text-xl font-medium mb-4">Motorsport Components</div>
              <div className="text-white/60 space-y-1">
                <p>Saloon | Rally Racing Windows</p>
                <p>NACA Ducts</p>
                <p>Headlight Lenses</p>
                <p>Sliding Windows</p>
              </div>
            </div>

            {/* Aerospace Components */}
            <div className="border border-white/10 rounded-2xl p-7 hover:border-white/30 transition-colors text-center md:text-left">
              <div className="text-xl font-medium mb-4">Aerospace Components</div>
              <div className="text-white/60 space-y-1">
                <p>Wing Tips | Elevator Tips | Rudder Caps</p>
                <p>Wheel Spats | Strut-Cuffs | Tail Cones</p>
                <p>Cowlings | Fairings</p>
              </div>
            </div>

            {/* Prototyping */}
            <div className="border border-white/10 rounded-2xl p-7 hover:border-white/30 transition-colors text-center md:text-left">
              <div className="text-xl font-medium mb-4">Prototyping</div>
              <div className="text-white/60 space-y-1">
                <p>Prototype Component Development to</p>
                <p>meet your needs & specifications</p>
                <p className="mt-2">Project Advice & Consultation Services</p>
              </div>
            </div>

            {/* Retrofitting and Reverse Engineering */}
            <div className="border border-white/10 rounded-2xl p-7 hover:border-white/30 transition-colors text-center md:text-left">
              <div className="text-xl font-medium mb-4">Retrofitting and Reverse Engineering</div>
              <div className="text-white/60 space-y-1">
                <p>Discontinued Aircraft Windows and</p>
                <p>Composite Components to restore</p>
                <p>with Precision and Certification.</p>
              </div>
            </div>
          </div>

          {/* Centered Request a Quote button */}
          <div className="mt-12 flex justify-center">
            <a href="https://staging-aces.netlify.app/contact/" className="button-primary h-11 px-6 whitespace-nowrap">
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
