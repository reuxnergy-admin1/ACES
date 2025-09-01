"use client";
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function InViewReveals() {
  const pathname = usePathname();
  useEffect(() => {
  // Re-arm on route changes
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  pathname;
  const raf2 = (fn: () => void) => requestAnimationFrame(() => requestAnimationFrame(fn));
    const selector = '[data-reveal], [data-reveal-stagger], [data-reveal-blur], [data-reveal-blur-stagger]';
  const q = () => Array.from(document.querySelectorAll<HTMLElement>(selector)).filter((el) => !el.classList.contains('is-inview'));
    let els = q();

  const markVisibleNow = () => {
      try {
        const vh = window.innerHeight || 0;
        for (const el of els) {
          const r = el.getBoundingClientRect();
      // Be generous on initial load to avoid flaking when just near the fold
      if (r.top < vh * 1.3 && r.bottom > -vh * 0.2) {
            raf2(() => el.classList.add('is-inview'));
          }
        }
      } catch { /* noop */ }
    };
    // Pre-warm everything currently in view after layout
    markVisibleNow();
    // Short follow-up to catch layout shifts right after mount
    window.setTimeout(markVisibleNow, 80);

    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      // Hard fallback if IO is unavailable
      const now = q();
      for (const el of now) el.classList.add('is-inview');
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            const t = e.target as HTMLElement;
      raf2(() => t.classList.add('is-inview'));
            io.unobserve(e.target);
          }
        }
      },
  // Trigger earlier before entering the fold to avoid flakes in CI
  { rootMargin: '0px 0px 12% 0px', threshold: 0 }
    );
    for (const el of els) io.observe(el);

    // Rescans for late content: fonts, images, and late renders
    const rescan = () => {
      els = q();
      for (const el of els) { io.observe(el); }
      markVisibleNow();
    };
  const t1 = window.setTimeout(rescan, 200);
  const t2 = window.setTimeout(rescan, 600);
  const t3 = window.setTimeout(rescan, 1500);
    try {
      type WithFonts = { fonts?: { ready?: Promise<unknown> } };
      const d = document as unknown as WithFonts;
      d.fonts?.ready?.then(() => rescan());
    } catch { /* noop */ }
    window.addEventListener('load', rescan, { once: true });

  // Remove hard force-visible fallback to avoid late pop-in flicker
  const t4 = 0 as unknown as number;

    // Mutation observer to catch dynamically added reveal targets (dev and live)
    const mo = new MutationObserver(() => {
      // Debounce via rAF
      requestAnimationFrame(rescan);
    });
    try {
      mo.observe(document.body, { subtree: true, childList: true, attributes: false });
    } catch { /* noop */ }

    return () => {
  window.clearTimeout(t1); window.clearTimeout(t2); window.clearTimeout(t3); if (t4) window.clearTimeout(t4);
      io.disconnect();
      try { mo.disconnect(); } catch { /* noop */ }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);
  return null;
}
