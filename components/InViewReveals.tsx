"use client";
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function InViewReveals() {
  const pathname = usePathname();
  useEffect(() => {
    const selector = '[data-reveal], [data-reveal-stagger], [data-reveal-blur], [data-reveal-blur-stagger]';
    const els = Array.from(document.querySelectorAll<HTMLElement>(selector)).filter((el) => !el.classList.contains('is-inview'));
    if (els.length === 0) return;
    // Pre-warm: mark anything already in view, but defer class add by 2 rAFs
    // so initial (hidden) state paints first and transitions are visible.
    try {
      const vh = window.innerHeight || 0;
      for (const el of els) {
        const r = el.getBoundingClientRect();
        if (r.top < vh * 0.9 && r.bottom > 0) {
          requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('is-inview')));
        }
      }
    } catch { /* noop */ }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            const t = e.target as HTMLElement;
            requestAnimationFrame(() => requestAnimationFrame(() => t.classList.add('is-inview')));
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: '0px 0px -20% 0px', threshold: 0.1 }
    );
    els.forEach((el) => io.observe(el));

    // Safety: re-scan shortly after hydration and again after images/layout settle
    const rescan = () => {
      const more = Array.from(document.querySelectorAll<HTMLElement>(selector)).filter((el) => !el.classList.contains('is-inview'));
      more.forEach((el) => io.observe(el));
    };
    const t1 = window.setTimeout(rescan, 200);
    const t2 = window.setTimeout(rescan, 800);

    return () => { window.clearTimeout(t1); window.clearTimeout(t2); io.disconnect(); };
  }, [pathname]);
  return null;
}
