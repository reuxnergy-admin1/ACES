import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-white/10 mt-24">
      <div className="mx-auto max-w-7xl px-4 py-12 grid md:grid-cols-3 gap-8 text-sm text-white/60">
        <div>
          <div className="text-white/80">ACES Aerodynamics</div>
          <div className="mt-2">SACAA-approved fabrication | MP39</div>
          <div className="mt-2"><a href="mailto:info@acesaerodynamics.com" className="wipe-link">info@acesaerodynamics.com</a></div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Link className="wipe-link" href="/about/history/">About</Link><br/>
            <Link className="wipe-link" href="/products/">Products</Link><br/>
            <Link className="wipe-link" href="/services/">Services</Link>
          </div>
          <div className="space-y-2">
            <Link className="wipe-link" href="/blog/">Blog</Link><br/>
            <Link className="wipe-link" href="/legal/privacy/">Privacy</Link><br/>
            <Link className="wipe-link" href="/legal/cookies/">Cookies</Link>
          </div>
        </div>
        <div className="text-right md:text-left">
          <div className="text-white/40">© {new Date().getFullYear()} ACES Aerodynamics</div>
        </div>
      </div>
    </footer>
  );
}
