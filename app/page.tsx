import Link from 'next/link';

export default function Page() {
  return (
    <section className="mx-auto max-w-7xl px-4 pt-36 pb-24">
      <div className="grid md:grid-cols-12 gap-8 items-end">
        <div className="md:col-span-7">
          <h1 className="text-5xl md:text-7xl font-light tracking-tight leading-[0.95]">
            Precision transparencies.<br/>
            <span className="text-white/70">Aerospace & motorsport.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-white/70">
            SACAA-approved (MP39) fabrication of cast acrylic windows, windscreens and transparent enclosures for certified and
            non-pressurised aircraft, plus high-performance composite components for aerospace and motorsport.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/contact/" className="button-primary">Request a Quote</Link>
            <Link href="/contact/?type=specialist" className="wipe-link px-5 py-3">Speak to a Specialist</Link>
          </div>
        </div>
        <div className="md:col-span-5 text-white/60 md:text-right">
          <div className="text-sm">Partners include Denel (formerly Atlas) and the Council for Scientific & Industrial Research.</div>
        </div>
      </div>

      <div className="mt-24 grid md:grid-cols-3 gap-8">
        {[
          {title:'Aerospace Transparencies', href:'/products/aircraft/'},
          {title:'Helicopter Transparencies', href:'/products/helicopters/'},
          {title:'Motorsport Components', href:'/products/motorsport/'},
        ].map((c) => (
          <Link key={c.href} href={c.href} className="group block border border-white/10 rounded-2xl p-7 hover:border-white/30 transition-colors">
            <div className="text-xl">{c.title}</div>
            <div className="mt-2 text-white/60">Design, tooling, thermoforming, finishing, coatings, QA.</div>
            <div className="mt-8 text-white/60 group-hover:text-white transition-colors">Explore →</div>
          </Link>
        ))}
      </div>
    </section>
  );
}
