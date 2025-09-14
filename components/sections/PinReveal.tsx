"use client";
import { useEffect, useRef } from "react";
// Minimal typings to avoid 'any' without pulling in gsap types
type GsapCore = {
  set: (targets: gsap.TweenTarget, vars: Record<string, unknown>) => void;
  timeline: (vars?: Record<string, unknown>) => { to: (targets: gsap.TweenTarget, vars: Record<string, unknown>, position?: number) => unknown };
  context?: (cb: () => void, scope?: Element | null) => { revert: () => void };
};
// Declare global gsap namespace for tween target typing
// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace gsap { type TweenTarget = gsap.DOMTarget | string | Array<gsap.DOMTarget | string>; type DOMTarget = Element | Window | Document; }

export default function PinReveal({ children }: Readonly<{ children: React.ReactNode }>) {
  const root = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let ctx: unknown;
    const anchor = root.current;
    (async () => {
      if (typeof window === 'undefined' || !anchor) { return; }
      // Synchronously pre-hide steps to avoid a 1st-paint flash before GSAP loads
      try {
        const steps = Array.from(anchor.querySelectorAll<HTMLElement>("[data-step]"));
        const r = anchor.getBoundingClientRect();
        const inViewEnough = r.top < (window.innerHeight * 0.9) && r.bottom > 0;
        for (const s of steps) {
          // Only pre-hide if the section isn’t already mostly in view; otherwise show immediately
          if (!inViewEnough) {
            s.style.opacity = '0';
            s.style.transform = 'translateY(24px) translateZ(0)';
            s.style.willChange = 'transform, opacity';
          } else {
            s.style.opacity = '1';
            s.style.transform = 'none';
            s.style.removeProperty('will-change');
          }
        }
      } catch { /* noop */ }
      // Respect reduced motion: render static content without pinning/animation
      const prefersReduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) { return; }
  const gsapMod = await import('gsap');
  const gsap = gsapMod.default as unknown as GsapCore & { registerPlugin?: (p: unknown) => void };
  const st = await import('gsap/ScrollTrigger');
  gsap.registerPlugin?.(st.ScrollTrigger);
  ctx = gsap.context?.(() => {
        // Mark ready so CSS can avoid flash-of-visible content
    anchor.setAttribute('data-pin-ready', '');
        // Ensure starting state is applied before first paint to avoid flicker
        gsap.set(["[data-step='1']", "[data-step='2']", "[data-step='3']"], { y: 24, opacity: 0 });
  const tl = gsap.timeline({
          defaults: { ease: 'power2.out' },
          scrollTrigger: {
    trigger: anchor,
            // Start a bit earlier so content is visible before intersecting the fixed header
            start: "top 72%",
            end: "bottom+=100% top",
            scrub: 0.5,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          }
        });
  // Apply as separate calls to avoid type chaining issues
  tl.to("[data-step='1']", { y: 0, opacity: 1, duration: 0.6, immediateRender: false }, 0.1);
  tl.to("[data-step='2']", { y: 0, opacity: 1, duration: 0.6, immediateRender: false }, 0.35);
  tl.to("[data-step='3']", { y: 0, opacity: 1, duration: 0.6, immediateRender: false }, 0.6);
    }, root.current);
    })();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return () => {
    try { (ctx as { revert?: () => void } | undefined)?.revert?.(); } catch { /* noop */ }
    // Best-effort: clear inline pre-hide styles on unmount
    try {
  const node = anchor;
      if (node) {
        const steps = Array.from(node.querySelectorAll<HTMLElement>("[data-step]"));
        for (const s of steps) { s.style.removeProperty('opacity'); s.style.removeProperty('transform'); s.style.removeProperty('will-change'); }
      }
    } catch { /* noop */ }
  };
  }, []);

  return <section ref={root} className="relative">{children}</section>;
}
