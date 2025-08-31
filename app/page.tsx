import Link from 'next/link';
import SheenCard from '@/components/SheenCard';
import ClientCarousel from '@/components/ClientCarousel';
import SectionBand from '@/components/layout/SectionBand';
import ContainerRow from '@/components/layout/ContainerRow';
import ContainerWide from '@/components/layout/ContainerWide';
import { Grid12, Span } from '@/components/layout/Grid12';
import Prose from '@/components/layout/Prose';

export default function Page() {
  return (
  <section className="grid-shell section-band pt-28">
  {/* Use wide container so hero aligns with product cards below */}
  <ContainerWide>
        <Grid12 className="items-start md:items-end">
          <Span cols={8}>
            <h1 className="text-5xl md:text-7xl font-light tracking-tight leading-[0.95] uc max-w-full">
              Precision transparencies.<br/>
              <span className="text-white/70">Aerospace & motorsport.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-white/70">
              SACAA-approved (MP39) fabrication of cast acrylic windows, windscreens and transparent enclosures for certified and
              non-pressurised aircraft, plus high-performance composite components for aerospace and motorsport.
            </p>
            <div className="mt-10 flex flex-wrap gap-3 items-center">
              <Link href="/contact/" className="button-primary h-11">Request a Quote</Link>
              {/* Match visual height to primary button for cleaner baseline alignment */}
              <Link href="/contact/?type=specialist" className="wipe-link px-5 h-11 inline-flex items-center uc">Speak to a Specialist</Link>
            </div>
          </Span>
          <Span cols={4}>
            <div className="text-sm">Partners include Denel (formerly Atlas) and the Council for Scientific & Industrial Research.</div>
          </Span>
        </Grid12>
      </ContainerWide>

  {/* Client carousel directly after hero */}
  <ClientCarousel className="mt-10 md:mt-16" reveal />

  <ContainerRow className="section-band pt-0" data-reveal-stagger>
        <Grid12>
        {[
          {title:'Aerospace Transparencies', href:'/products/aircraft/'},
          {title:'Helicopter Transparencies', href:'/products/helicopters/'},
          {title:'Motorsport Components', href:'/products/motorsport/'},
        ].map((c) => (
          <SheenCard key={c.href} className="md:col-span-4" data-reveal>
            <Link href={c.href} className="group block border border-white/10 rounded-2xl p-7 hover:border-white/30 transition-colors link-underline">
              <div className="text-xl">{c.title}</div>
              <div className="mt-2 text-white/60">Design, tooling, thermoforming, finishing, coatings, QA.</div>
              <div className="mt-8 text-white/60 group-hover:text-white transition-colors">Explore →</div>
            </Link>
          </SheenCard>
        ))}
        </Grid12>
      </ContainerRow>

  {/* Capabilities */}
  <SectionBand>
    <ContainerRow>
      <Grid12 data-reveal-stagger>
        <Span cols={12}><h2 className="text-2xl uc tracking-[0.08em]">Capabilities</h2></Span>
        {[
          {h:'Design & Engineering', p:'Reverse‑engineering, CAD/CAM, fixture design and DFMA consultation.'},
          {h:'Tooling & CNC', p:'Patterns, matched dies, and precision trimming for consistent fit.'},
          {h:'Thermoforming & Annealing', p:'Controlled forming and stress‑relief for optical stability.'},
          {h:'Finishing & Drilling', p:'Edge finishing, drilling, and mount prep to spec tolerances.'},
          {h:'Coatings', p:'Scratch‑resistant and anti‑fog coatings via approved processes.'},
          {h:'QA & Documentation', p:'Traceability, VLT/haze mapping, and release documentation.'},
        ].map((x) => (
          <SheenCard key={x.h} className="md:col-span-4" data-reveal>
            <div className="block border border-white/10 rounded-2xl p-7">
              <div className="text-xl">{x.h}</div>
              <div className="mt-2 text-white/60">{x.p}</div>
            </div>
          </SheenCard>
        ))}
      </Grid12>
    </ContainerRow>
  </SectionBand>

  {/* Compliance & QA */}
  <SectionBand>
    <ContainerRow>
      <Grid12 data-reveal-stagger>
        <Span cols={8}>
          <Prose>
            <h2>Compliance & QA</h2>
            <p>SACAA‑approved (MP39). Documented process control with full traceability and optical inspection. Our release documentation accompanies every shipment.</p>
          </Prose>
        </Span>
        <Span cols={4}>
          <div className="grid grid-cols-1 gap-2">
            {[ 'VLT ≥ 90%*', 'Haze ≤ 2.0%*', 'Scratch‑resist. per spec', 'Traceability docs', 'QA release per lot' ].map((b) => (
              <div key={b} className="surface surface-90 surface-strong radius-md elevate-sm px-4 py-3 text-white/80">{b}</div>
            ))}
            <div className="text-[11px] text-white/40">*Representative; per material system and thickness. See release docs.</div>
          </div>
        </Span>
      </Grid12>
    </ContainerRow>
  </SectionBand>

  {/* Sectors We Serve */}
  <SectionBand>
    <ContainerRow>
      <Grid12 data-reveal-stagger>
        <Span cols={8}>
          <h2 className="text-2xl uc tracking-[0.08em]">Sectors We Serve</h2>
          <ul className="mt-4 space-y-2 text-white/70">
            <li><strong className="text-white/90">AMOs/Heli AMOs:</strong> predictable lead‑times, repeatability, and full documentation.</li>
            <li><strong className="text-white/90">Flight Schools/Commercial:</strong> durable transparencies, lifecycle value, quick turnaround.</li>
            <li><strong className="text-white/90">HEMS/Rescue & Police:</strong> clarity in adverse conditions, coatings for mission readiness.</li>
            <li><strong className="text-white/90">Motorsport:</strong> low mass, high rigidity, surface quality under heat and load.</li>
          </ul>
        </Span>
        <Span cols={4}>
          <div className="surface surface-90 surface-strong radius-md p-5">
            <div className="text-white/80">Speak to our engineers about your application.</div>
            <div className="mt-4 flex gap-3">
              <Link href="/contact/" className="button-primary h-11">Request a Quote</Link>
              <Link href="/contact/?type=specialist" className="wipe-link h-11 inline-flex items-center uc px-4">Specialist Call</Link>
            </div>
          </div>
        </Span>
      </Grid12>
    </ContainerRow>
  </SectionBand>

  {/* Process */}
  <SectionBand>
    <ContainerRow>
      <Grid12 data-reveal-stagger>
        <Span cols={12}><h2 className="text-2xl uc tracking-[0.08em]">Process</h2></Span>
        {[
          ['01','Scope','Define requirements, constraints, and acceptance criteria.'],
          ['02','Design','CAD/CAM and fixtures for repeatable outcomes.'],
          ['03','Tooling','Patterns and matched dies to tolerance.'],
          ['04','Forming','Controlled thermoforming and annealing.'],
          ['05','Finishing','Edges, drilling, coatings as specified.'],
          ['06','QA & Docs','Optical checks and release documentation.'],
        ].map(([n,t,d]) => (
          <div key={n} className="md:col-span-2 border-t border-white/10 pt-4">
            <div className="text-white/50 text-sm uc tracking-[0.12em]">{n}</div>
            <div className="mt-1 text-white">{t}</div>
            <div className="mt-1 text-white/60 text-sm">{d}</div>
          </div>
        ))}
      </Grid12>
    </ContainerRow>
  </SectionBand>

  {/* Insights */}
  <SectionBand>
    <ContainerRow>
      <Grid12>
        <Span cols={12}><h2 className="text-2xl uc tracking-[0.08em]">Insights</h2></Span>
        {[
          {title:'Choosing coatings for clarity and durability', href:'/blog/'},
          {title:'Avoiding forming defects in acrylic', href:'/blog/'},
          {title:'QA metrics that matter (VLT, haze)', href:'/blog/'},
        ].map((p) => (
          <SheenCard key={p.title} className="md:col-span-4" data-reveal>
            <Link href={p.href} className="group block border border-white/10 rounded-2xl p-7 hover:border-white/30 transition-colors link-underline">
              <div className="text-xl">{p.title}</div>
              <div className="mt-2 text-white/60">Short engineering notes from our team.</div>
              <div className="mt-8 text-white/60 group-hover:text-white transition-colors">Read →</div>
            </Link>
          </SheenCard>
        ))}
      </Grid12>
    </ContainerRow>
  </SectionBand>
    </section>
  );
}
