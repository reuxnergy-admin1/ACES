import Link from 'next/link';
import SheenCard from '@/components/SheenCard';
import SectionBand from '@/components/layout/SectionBand';
import ContainerRow from '@/components/layout/ContainerRow';
import ContainerWide from '@/components/layout/ContainerWide';
import { Grid12, Span } from '@/components/layout/Grid12';
import Prose from '@/components/layout/Prose';
import ClientCarousel from '@/components/ClientCarousel';

export default function Page() {
  return (
    <>
      {/* Hero section - proper clearance below header */}
      <SectionBand className="!pt-[113px] sm:!pt-[120px] lg:!pt-[126px]">
        <ContainerWide>
          <Grid12 className="items-start md:items-end" data-reveal-blur-stagger>
            <Span cols={12} className="text-center md:text-left">
              <h1 className="text-[29.2px] sm:text-[38px] lg:text-[48.6px] font-light tracking-tight leading-[0.95] uc max-w-[22ch] mx-auto md:mx-0 md:ml-0">
                Aerospace & Motorsport Specialist Engineering Components
              </h1>
              <p className="mt-6 body max-w-reading text-white text-center md:text-left mx-auto md:mx-0 md:ml-0">
                SACAA-approved (MP39) blanket approval for all certified and NTCA unpressured fixed- and rotary-wing aircraft types.
              </p>
              <p className="mt-4 body max-w-reading text-white text-center md:text-left mx-auto md:mx-0 md:ml-0">
                ACES Aerodynamics delivers precision-engineered transparencies and composite components for aviation and motorsport.
              </p>
            </Span>
          </Grid12>
        </ContainerWide>
      </SectionBand>

      {/* Products and Services - New 6-card grid */}
      <SectionBand id="products-and-services">
        <ContainerRow>
          <Grid12 data-reveal-stagger>
            <Span cols={12} className="text-center md:text-left"><h2 className="text-2xl uc tracking-[0.08em]">Products and Services</h2></Span>
            {[
              {
                title: 'Aircraft Transparencies',
                subtitle: 'All Certified and Uncertified Unpressurised Aircraft Types',
                details: 'Windows | Windshields | Side Windows',
                href: '/products/aircraft/'
              },
              {
                title: 'Helicopter Transparencies',
                subtitle: 'All Certified and Uncertified Unpressurised Helicopter Types',
                details: 'Canopy | Bubble | Side Windows',
                href: '/products/helicopters/'
              },
              {
                title: 'Motorsport Components',
                subtitle: 'Saloon | Rally Racing Windows',
                details: 'NACA Ducts | Headlight Lenses | Sliding Windows',
                href: '/products/motorsport/'
              },
              {
                title: 'Aerospace Components',
                subtitle: 'Wing Tips | Elevator Tips | Rudder Caps',
                details: 'Wheel Spats | Strut-Cuffs | Tail Cones | Cowlings | Fairings',
                href: '/products/'
              },
              {
                title: 'Prototyping',
                subtitle: 'Prototype Component Development to meet your needs & specifications',
                details: 'Project Advice & Consultation Services',
                href: '/services/'
              },
              {
                title: 'Retrofitting and Reverse Engineering',
                subtitle: 'Discontinued Aircraft Windows and Composite Components',
                details: 'Restore with Precision and Certification',
                href: '/services/'
              },
            ].map((c) => (
              <SheenCard key={c.title} className="md:col-span-4" data-reveal>
                <Link href={c.href} className="group block border border-white/10 rounded-2xl p-7 hover:border-white/30 transition-colors link-underline h-full text-center md:text-left">
                  <div className="text-xl">{c.title}</div>
                  <div className="mt-2 text-white text-sm">{c.subtitle}</div>
                  <div className="mt-2 text-white text-sm">{c.details}</div>
                </Link>
              </SheenCard>
            ))}
            <Span cols={12}>
              <div className="mt-8 flex justify-center">
                <a href="/contact/" className="button-primary h-11 px-6 whitespace-nowrap">
                  <span aria-hidden="true" className="reveal-line h top" />
                  <span aria-hidden="true" className="reveal-line h bottom" />
                  <span aria-hidden="true" className="reveal-line v left" />
                  <span aria-hidden="true" className="reveal-line v right" />
                  <span className="sr-only">Request a Quote</span>
                  <span aria-hidden="true">Request a Quote</span>
                  <span className="arrow" aria-hidden="true" style={{ marginLeft: '0.4rem' }}>→</span>
                </a>
              </div>
            </Span>
          </Grid12>
        </ContainerRow>
      </SectionBand>

      {/* Our Three Step Process */}
      <SectionBand>
        <ContainerRow>
          <Grid12 data-reveal-stagger>
            <Span cols={12} className="text-center md:text-left"><h2 className="text-2xl uc tracking-[0.08em]">Our Three Step Process</h2></Span>
            {[
              ['01', 'Scope', 'Define requirements, constraints, and acceptance criteria.'],
              ['02', 'Production', 'Robust processes, repeatable quality, flight-ready windows.'],
              ['03', 'QA, Documentation, Delivery', 'Optical checks and release documentation delivered with pace.'],
            ].map(([n, t, d]) => (
              <div key={n} className="md:col-span-4 border-t border-white/10 pt-4">
                <div className="text-white text-sm uc tracking-[0.12em] text-center md:text-left">{n}</div>
                <div className="mt-1 body text-white text-left">{t}</div>
                <div className="mt-1 body text-white text-sm text-left">{d}</div>
              </div>
            ))}
          </Grid12>
        </ContainerRow>
      </SectionBand>

      {/* Compliance & QA */}
      <SectionBand>
        <ContainerRow>
          <Grid12 data-reveal-stagger>
            <Span cols={12} className="text-center md:text-left">
              <Prose className="mx-auto md:mx-0 md:ml-0">
                <h2 className="text-center md:text-left mb-4">Compliance and QA</h2>
                <p className="text-center md:text-left">Documented process control with full traceability and optical inspection. Our release documentation (CA21-19 airworthiness approval tag) accompanies every shipment.</p>
              </Prose>
            </Span>
            <SheenCard className="md:col-span-6" data-reveal>
              <div className="block border border-white/10 rounded-2xl p-7 text-center md:text-left">
                <div className="text-xl">MP39 - SACAA Approved</div>
                <div className="mt-2 text-white">Proven Quality - 99.9% First Pass Yield Rate</div>
              </div>
            </SheenCard>
            <SheenCard className="md:col-span-6" data-reveal>
              <div className="block border border-white/10 rounded-2xl p-7 text-center md:text-left">
                <div className="text-xl">CA21-19 Airworthiness Approval Tag</div>
                <div className="mt-2 text-white">Effortless Compliance</div>
              </div>
            </SheenCard>
          </Grid12>
        </ContainerRow>
      </SectionBand>

      {/* Trusted By - Client Carousel */}
      <SectionBand className="!py-2 md:!py-4">
        <ContainerRow>
          <Grid12 data-reveal-stagger>
            <Span cols={12} className="text-center">
              <h2 className="text-2xl uc tracking-[0.08em]">Trusted By</h2>
            </Span>
          </Grid12>
        </ContainerRow>
        <ClientCarousel reveal />
      </SectionBand>

      {/* Order with ACES CTA */}
      <SectionBand className="!pt-2 md:!pt-4 !pb-0">
        <div className="border-t border-b border-white/10">
          <ContainerRow>
            <div className="py-8 flex flex-col items-center text-center md:flex-row md:items-center md:justify-between md:text-left gap-4">
              <h2 className="text-2xl uc tracking-[0.08em]">Order with ACES</h2>
              <a href="/contact/" className="button-primary h-11 px-6 whitespace-nowrap">
                <span aria-hidden="true" className="reveal-line h top" />
                <span aria-hidden="true" className="reveal-line h bottom" />
                <span aria-hidden="true" className="reveal-line v left" />
                <span aria-hidden="true" className="reveal-line v right" />
                <span className="sr-only">Request a Quote</span>
                <span aria-hidden="true">Request a Quote</span>
                <span className="arrow" aria-hidden="true" style={{ marginLeft: '0.4rem' }}>→</span>
              </a>
            </div>
          </ContainerRow>
        </div>
      </SectionBand>

      {/* Insights - Dormant until first article */}
      {/* Uncomment when ready to publish articles
      <SectionBand>
        <ContainerRow>
          <Grid12>
            <Span cols={12}><h2 className="text-2xl uc tracking-[0.08em]">Insights</h2></Span>
            <Span cols={12}>
              <p className="text-white/60">Coming soon - engineering insights from our team.</p>
            </Span>
          </Grid12>
        </ContainerRow>
      </SectionBand>
      */}
    </>
  );
}
