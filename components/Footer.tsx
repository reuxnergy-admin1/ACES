"use client";
import Link from 'next/link';
import { useEffect, useRef } from 'react';

export function Footer() {
  const ref = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) return;
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
  return (
    <footer ref={ref} className="relative border-t border-white/10 mt-24">
      <div className="footer-sheen" aria-hidden="true" />
      <div className="grid-shell">
        <div className="container-wide py-6 flex items-center justify-between">
          <div className="text-white/40 text-sm">© ACES Plastics CC t/a ACES Aerodynamics</div>
          <Link href="#main-content" className="link-underline text-white/70 hover:text-white text-sm">Back to top</Link>
        </div>
      </div>
    </footer>
  );
}
