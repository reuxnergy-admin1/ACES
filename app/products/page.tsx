import Link from 'next/link';

export default function Page() {
  return (
    <section className="mx-auto max-w-6xl px-4 pt-36 pb-24">
      <h1 className="text-4xl md:text-5xl font-light">Products</h1>
      <div className="mt-10 grid md:grid-cols-3 gap-8">
        <Link className="group block border border-white/10 rounded-2xl p-7 hover:border-white/30 transition-colors" href="/products/aircraft/">
          <div className="text-xl">Aircraft</div><div className="mt-2 text-white/60">Windows, windscreens, enclosures</div>
        </Link>
        <Link className="group block border border-white/10 rounded-2xl p-7 hover:border-white/30 transition-colors" href="/products/helicopters/">
          <div className="text-xl">Helicopters</div><div className="mt-2 text-white/60">Cabin transparencies and doors</div>
        </Link>
        <Link className="group block border border-white/10 rounded-2xl p-7 hover:border-white/30 transition-colors" href="/products/motorsport/">
          <div className="text-xl">Motorsport</div><div className="mt-2 text-white/60">Lightweight glazing & components</div>
        </Link>
      </div>
    </section>
  );
}
