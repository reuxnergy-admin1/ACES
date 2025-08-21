import StaggerReveal from '@/components/StaggerReveal';
import Link from 'next/link';

export default function Page() {
  return (
    <section className="grid-shell pt-36 pb-24">
  <div className="container-row grid-12">
        <h1 className="text-4xl md:text-5xl font-light col-span-12 md:col-span-8">Products</h1>
      </div>
      <StaggerReveal>
  <div className="container-row mt-10 grid-12">
        <Link className="group block border border-white/10 rounded-2xl p-7 hover:border-white/30 transition-colors col-span-12 md:col-span-4" href="/products/aircraft/">
          <div className="text-xl">Aircraft</div><div className="mt-2 text-white/60">Windows, windscreens, enclosures</div>
        </Link>
        <Link className="group block border border-white/10 rounded-2xl p-7 hover:border-white/30 transition-colors col-span-12 md:col-span-4" href="/products/helicopters/">
          <div className="text-xl">Helicopters</div><div className="mt-2 text-white/60">Cabin transparencies and doors</div>
        </Link>
        <Link className="group block border border-white/10 rounded-2xl p-7 hover:border-white/30 transition-colors col-span-12 md:col-span-4" href="/products/motorsport/">
          <div className="text-xl">Motorsport</div><div className="mt-2 text-white/60">Lightweight glazing & components</div>
        </Link>
        </div>
      </StaggerReveal>
    </section>
  );
}
