"use client";
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function InViewReveals() {
  const pathname = usePathname();
  useEffect(() => {
    const selector = '[data-reveal], [data-reveal-stagger], [data-reveal-blur], [data-reveal-blur-stagger]';
    const q = () => Array.from(document.querySelectorAll<HTMLElement>(selector)).filter((el) => !el.classList.contains('is-inview'));
    let els = q();

    const markVisibleNow = () => {
      try {
        const vh = window.innerHeight || 0;
        for (const el of els) {
          const r = el.getBoundingClientRect();
          if (r.top < vh * 1.1 && r.bottom > -vh * 0.1) {
            requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('is-inview')));
          }
        }
      } catch { /* noop */ }
    };
    // Pre-warm everything currently in view after layout
    markVisibleNow();

  if (typeof window.IntersectionObserver === 'undefined') {
      // Hard fallback if IO is unavailable
      q().forEach((el) => el.classList.add('is-inview'));
      return;
    }
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
      { rootMargin: '0px 0px -10% 0px', threshold: 0 }
    );
    els.forEach((el) => io.observe(el));

    // Rescans for late content: fonts, images, and late renders
    const rescan = () => { els = q(); els.forEach((el) => io.observe(el)); markVisibleNow(); };
    const t1 = window.setTimeout(rescan, 120);
    const t2 = window.setTimeout(rescan, 420);
    const t3 = window.setTimeout(rescan, 1200);
  try { (document as Document & { fonts?: { ready?: Promise<unknown> } }).fonts?.ready?.then(rescan); } catch { /* noop */ }
    window.addEventListener('load', rescan, { once: true });

    // Hard fallback: force anything near viewport to visible after 2.5s
    const t4 = window.setTimeout(() => {
      q().forEach((el) => el.classList.add('is-inview'));
    }, 2500);

    // Mutation observer to catch dynamically added reveal targets (dev and live)
    const mo = new MutationObserver(() => {
      // Debounce via rAF
      requestAnimationFrame(rescan);
    });
    try {
      mo.observe(document.body, { subtree: true, childList: true, attributes: false });
    } catch { /* noop */ }

    return () => {
      window.clearTimeout(t1); window.clearTimeout(t2); window.clearTimeout(t3); window.clearTimeout(t4);
      io.disconnect();
      try { mo.disconnect(); } catch { /* noop */ }
    };
  }, [pathname]);
  return null;
}
