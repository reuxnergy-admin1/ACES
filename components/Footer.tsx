"use client";
import Link from 'next/link';
import { Tooltip } from './Tooltip';
import { Span } from '@/components/layout/Grid12';
import { useEffect, useRef } from 'react';

export function Footer() {
  const ref = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e: PointerEvent) => {
      const y = e.clientY;
      const bottomDist = Math.max(0, window.innerHeight - y);
      const thresh = 240;
      const alpha = Math.max(0, Math.min(1, (thresh - bottomDist) / thresh));
      document.documentElement.style.setProperty('--footer-alpha', String(alpha));
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  // Proximity highlight for footer link row
  const proxRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = proxRef.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const localX = e.clientX - rect.left;
      el.style.setProperty('--nav-x', `${localX - 90}px`);
      el.style.setProperty('--nav-opacity', '1');
      const links = Array.from(el.querySelectorAll('a[href]')).filter((n): n is HTMLElement => n instanceof HTMLElement);
      let closest: { a: HTMLElement; dist: number } | null = null;
      for (const a of links) {
        const r = a.getBoundingClientRect();
        const center = r.left + r.width / 2 - rect.left;
        const dist = Math.abs(localX - center);
        const prox = Math.max(0, 1 - dist / 220);
        a.style.setProperty('--prox-opacity', String(0.6 + prox * 0.4));
        a.style.setProperty('--prox-scale', String(1 + prox * 0.04));
        if (!closest || dist < closest.dist) closest = { a, dist };
      }
      // Underline slider positioning
      try {
        const target = closest?.a;
        const ul = el.querySelector<HTMLElement>('.nav-underline');
        if (target && ul) {
          const tr = target.getBoundingClientRect();
          const x = tr.left - rect.left;
          el.style.setProperty('--ul-x', `${x}px`);
          el.style.setProperty('--ul-w', `${tr.width}px`);
          el.style.setProperty('--ul-o', '1');
        }
      } catch { /* noop */ }
    };
    const onLeave = () => {
      el.style.setProperty('--nav-opacity', '0');
      const links = Array.from(el.querySelectorAll('a[href]')).filter((n): n is HTMLElement => n instanceof HTMLElement);
      for (const a of links) { a.style.removeProperty('--prox-opacity'); a.style.removeProperty('--prox-scale'); }
      el.style.setProperty('--ul-o', '0');
    };
    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    window.addEventListener('resize', onLeave);
    return () => { el.removeEventListener('mousemove', onMove); el.removeEventListener('mouseleave', onLeave); window.removeEventListener('resize', onLeave); };
  }, []);
  return (
    <footer ref={ref} className="relative border-t border-white/10 mt-24">
      {/* Subtle top sheen inspired by Chronicle */}
      <div className="footer-sheen" aria-hidden="true" />
      <div className="grid-shell">
        {/* Engagement strip */}
        <div className="container-row py-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-white/10" data-reveal>
          <div className="text-lg md:text-xl text-white/90 uc tracking-[0.08em]">Work with ACES</div>
          <Link href="/contact/" className="sheen button-solid arrow-shift button--md">REQUEST A <span className="btn-tail"><span>QUOTE</span> <span className="arrow" aria-hidden>→</span></span></Link>
        </div>
  <div className="container-row py-16 grid-12 gutter text-sm text-white/70">
          <Span cols={4}>
            <div className="text-white uc tracking-wider">ACES Aerodynamics</div>
            <div className="mt-2 text-white/70">SACAA-approved fabrication | MP39</div>
            <div className="mt-2">
              <a href="mailto:info@acesaerodynamics.com" className="link-underline text-white/80 hover:text-white">info@acesaerodynamics.com</a>
            </div>
            <div className="mt-1 text-white/70">WhatsApp: <a className="link-underline text-white/80 hover:text-white" href="https://wa.me/27600000000" target="_blank" rel="noopener noreferrer">+27 60 000 0000</a></div>
            <div className="mt-1 text-white/70">Pretoria, Gauteng, South Africa</div>
          </Span>
          <Span cols={4}>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="uc tracking-wider text-white/60 text-xs">Company</div>
                <div className="mt-2 space-y-2">
                  <Link className="sheen link-underline text-white/85 hover:text-white" href="/about/history/">About</Link><br/>
                  <Link className="sheen link-underline text-white/85 hover:text-white" href="/blog/">Blog</Link>
                </div>
              </div>
              <div>
                <div className="uc tracking-wider text-white/60 text-xs">Legal</div>
                <div className="mt-2 space-y-2">
                  <Link className="sheen link-underline text-white/85 hover:text-white" href="/legal/privacy/">Privacy</Link><br/>
                  <Link className="sheen link-underline text-white/85 hover:text-white" href="/legal/cookies/">Cookies</Link>
                </div>
              </div>
            </div>
          </Span>
          <Span cols={4}>
            <div className="uc tracking-wider text-white/60 text-xs">Follow</div>
            <div className="mt-3 flex items-center gap-3">
              <Tooltip label="LinkedIn">
                <a className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 transition-colors" href="https://www.linkedin.com/company/aces-aerodynamics" target="_blank" rel="noopener noreferrer">
                  <span className="sr-only">LinkedIn</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM.5 8h4V24h-4V8zm7.5 0h3.8v2.2h.1c.5-.9 1.7-2.2 3.6-2.2 3.8 0 4.5 2.5 4.5 5.7V24h-4v-7.9c0-1.9 0-4.4-2.7-4.4-2.7 0-3.1 2.1-3.1 4.3V24h-4V8z"/></svg>
                </a>
              </Tooltip>
              <Tooltip label="Instagram">
                <a className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 transition-colors" href="https://www.instagram.com/acesaerodynamics" target="_blank" rel="noopener noreferrer">
                  <span className="sr-only">Instagram</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.17.056 1.97.24 2.427.403.61.224 1.045.494 1.503.952.458.458.728.893.952 1.503.163.457.347 1.257.403 2.427.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.056 1.17-.24 1.97-.403 2.427a4.41 4.41 0 01-.952 1.503 4.41 4.41 0 01-1.503.952c-.457.163-1.257.347-2.427.403-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.17-.056-1.97-.24-2.427-.403a4.41 4.41 0 01-1.503-.952 4.41 4.41 0 01-.952-1.503c-.163-.457-.347-1.257-.403-2.427C2.175 15.584 2.163 15.204 2.163 12s.012-3.584.07-4.85c.056-1.17.24-1.97.403-2.427.224-.61.494-1.045.952-1.503.458-.458.893-.728 1.503-.952.457-.163 1.257-.347 2.427-.403 1.266-.058 1.646-.07 4.85-.07zM12 0C8.741 0 8.332.012 7.053.07c-1.29.059-2.173.248-2.944.53a6.87 6.87 0 00-2.49 1.623A6.87 6.87 0 00.996 4.717c-.282.771-.471 1.654-.53 2.944C.41 8.94.398 9.35.398 12.001c0 2.651.012 3.061.07 4.34.059 1.29.248 2.173.53 2.944a6.87 6.87 0 001.623 2.49 6.87 6.87 0 002.49 1.623c.771.282 1.654.471 2.944.53C8.94 23.59 9.35 23.602 12 23.602c2.651 0 3.061-.012 4.34-.07 1.29-.059 2.173-.248 2.944-.53a6.87 6.87 0 002.49-1.623 6.87 6.87 0 001.623-2.49c.282-.771.471-1.654.53-2.944.058-1.279.07-1.689.07-4.34 0-2.651-.012-3.061-.07-4.34-.059-1.29-.248-2.173-.53-2.944a6.87 6.87 0 00-1.623-2.49A6.87 6.87 0 0019.284.6c-.771-.282-1.654-.471-2.944-.53C15.061.012 14.651 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zm6.406-1.683a1.44 1.44 0 110 2.88 1.44 1.44 0 010-2.88z"/></svg>
                </a>
              </Tooltip>
            </div>
          </Span>
          <Span cols={12}>
            <div className="mt-10 text-white/60">
              <nav ref={proxRef} className="nav-prox nav-prox--footer relative flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm uc tracking-[0.08em] overflow-hidden" aria-label="Footer links">
                <div aria-hidden="true" className="nav-prox__highlight" />
                <div aria-hidden="true" className="nav-underline" />
                <Link href="/products/" data-prox className="link-underline text-white/70 hover:text-white">Products</Link>
                <span className="opacity-50" aria-hidden="true">•</span>
                <Link href="/services/" data-prox className="link-underline text-white/70 hover:text-white">Services</Link>
                <span className="opacity-50" aria-hidden="true">•</span>
                <Link href="/blog/" data-prox className="link-underline text-white/70 hover:text-white">Blog</Link>
                <span className="opacity-50" aria-hidden="true">•</span>
                <Link href="#main-content" data-prox className="link-underline text-white/70 hover:text-white">Back to top</Link>
              </nav>
              <div className="mt-4 text-center text-white/40 text-sm">
                <span className="inline-flex items-center gap-2"><span className="inline-block w-2 h-2 rounded-full bg-white/60" aria-hidden /> SACAA MP39</span>
                <span className="mx-2" aria-hidden="true">•</span>
                © {new Date().getFullYear()} ACES Aerodynamics
              </div>
            </div>
          </Span>
        </div>
      </div>
    </footer>
  );
}
