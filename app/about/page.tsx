import Link from 'next/link';
import SheenCard from '@/components/SheenCard';
import SectionBand from '@/components/layout/SectionBand';
import ContainerRow from '@/components/layout/ContainerRow';
import ContainerWide from '@/components/layout/ContainerWide';
import { Grid12, Span } from '@/components/layout/Grid12';
import Prose from '@/components/layout/Prose';

export default function Page() {
  return (
    <>
      {/* Hero section */}
      <SectionBand className="!pt-[113px] sm:!pt-[120px] lg:!pt-[126px]">
        <ContainerWide>
          <Grid12 className="items-start md:items-end" data-reveal-blur-stagger>
            <Span cols={12} className="text-center md:text-left">
              <h1 className="text-4xl font-light">
                About ACES
              </h1>
              <p className="mt-6 body max-w-reading text-white/70 text-center md:text-left mx-auto md:mx-0">
                Acrylic and Composite Engineering Services (ACES) is a South African group built around one simple idea: aircraft parts should inspire confidence every time you fly. We specialise in aircraft windows and composite components, from well-known production parts to custom pieces for prototype and special-build aircraft.
              </p>
              <p className="mt-4 body max-w-reading text-white/70 text-center md:text-left mx-auto md:mx-0">
                If it needs to fly, and it needs to be right, that&apos;s the work we enjoy most.
              </p>
            </Span>
          </Grid12>
        </ContainerWide>
      </SectionBand>

      {/* How It All Started */}
      <SectionBand>
        <ContainerRow>
          <Grid12 data-reveal-stagger>
            <Span cols={12} className="text-center md:text-left"><h2 className="text-2xl uc tracking-[0.08em]">How It All Started</h2></Span>
            <Span cols={12} className="md:col-span-8 text-center md:text-left mx-auto md:mx-0">
              <Prose>
                <p>ACES Plastics CC t/a ACES Aerodynamics was started by Dirk Uys, whose career in aerospace stretches over decades. Before launching ACES, Dirk worked at CSIR and Atlas (now Denel), where he was involved in everything from materials and tooling to helicopter and jet design and builds.</p>
                <p>Over the years he has helped write the reference books and manuals on composite components used by aviation artisans and has contributed to standards and regulations for the South African aviation industry.</p>
                <p>Dirk has also consulted on many aircraft project design and builds, including aerobatic aircraft and special-mission aircraft, and has quietly built a reputation as someone who understands both the engineering and the real-world demands of aviation. That experience is at the core of what ACES does today.</p>
                <p>Through this work, Dirk has firmly cemented his influence in the South African aviation community, and that expertise flows directly into every product we deliver.</p>
              </Prose>
            </Span>
          </Grid12>
        </ContainerRow>
      </SectionBand>

      {/* Our Story Since 1994 */}
      <SectionBand>
        <ContainerRow>
          <Grid12 data-reveal-stagger>
            <Span cols={12} className="text-center md:text-left"><h2 className="text-2xl uc tracking-[0.08em]">Our Story Since 1994</h2></Span>
            <Span cols={12} className="md:col-span-8 text-center md:text-left mx-auto md:mx-0">
              <Prose>
                <p>The ACES group was founded in 1994, and from the beginning the focus has been on delivering reliable, high-quality components. We&apos;ve supplied popular aircraft parts that many owners know well, as well as one-off and customised components for prototype aircraft and special projects.</p>
                <p>We work with aircraft maintenance, builders, and designers who want more than just a part number, people who appreciate honest advice, practical solutions and long-term performance.</p>
              </Prose>
            </Span>
          </Grid12>
        </ContainerRow>
      </SectionBand>

      {/* What We Do */}
      <SectionBand>
        <ContainerRow>
          <Grid12 data-reveal-stagger>
            <Span cols={12} className="text-center md:text-left"><h2 className="text-2xl uc tracking-[0.08em]">What We Do</h2></Span>
            <Span cols={12} className="md:col-span-8 text-center md:text-left mx-auto md:mx-0">
              <Prose>
                <p>Our windows are built for clarity, durability and safety, and our composite components are designed with weight, strength and real operational use in mind. Whether you&apos;re maintaining an existing aircraft, restoring a classic, or bringing a new design to life, we aim to be the team you can rely on for well-made, well-thought-out parts.</p>
              </Prose>
            </Span>
          </Grid12>
        </ContainerRow>
      </SectionBand>

      {/* Our Principles */}
      <SectionBand>
        <ContainerRow>
          <Grid12 data-reveal-stagger>
            <Span cols={12} className="text-center md:text-left"><h2 className="text-2xl uc tracking-[0.08em]">Our Principles</h2></Span>
            <Span cols={12} className="text-center md:text-left">
              <p className="body text-white/70 max-w-reading mx-auto md:mx-0 md:ml-0">Dirk&apos;s principles are embedded in every window and composite component we manufacture:</p>
            </Span>
            {[
              {
                title: 'Safety First',
                description: "No shortcuts. Ever. If it's going on an aircraft or race car, it has to be right.",
              },
              {
                title: 'Highest Quality Standards',
                description: 'From material selection to final inspection, we aim for consistent, repeatable excellence.',
              },
              {
                title: 'Clarity',
                description: 'We strive for crystal-clear optics and equally clear, honest communication with our customers.',
              },
              {
                title: 'Continuous Improvement',
                description: 'Every project is an opportunity to refine, improve, and move closer to engineering perfection.',
              },
            ].map((principle) => (
              <SheenCard key={principle.title} className="md:col-span-6 mx-auto md:mx-0" data-reveal>
                <div className="block border border-white/10 rounded-2xl p-7 text-center md:text-left">
                  <div className="text-xl">{principle.title}</div>
                  <div className="mt-2 text-white/60">{principle.description}</div>
                </div>
              </SheenCard>
            ))}
          </Grid12>
        </ContainerRow>
      </SectionBand>

      {/* Closing CTA */}
      <SectionBand>
        <ContainerRow>
          <Grid12 data-reveal-stagger>
            <Span cols={12} className="text-center md:text-left">
              <Prose className="mx-auto md:mx-0">
                <p>If you need aircraft/motorsport windows or composite components made by people who genuinely care about performance and safety, you&apos;re in the right place.</p>
              </Prose>
            </Span>
            <Span cols={12}>
              <div className="mt-8 flex justify-center">
                <a href="https://staging-aces.netlify.app/contact/" className="button-primary h-11 px-8 whitespace-nowrap">
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
    </>
  );
}
