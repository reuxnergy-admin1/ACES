"use client";
import { useEffect, useRef } from "react";

export default function FooterUnmask({ children }: { children: React.ReactNode }) {
  const root = useRef<HTMLElement | null>(null);
  useEffect(() => {
    (async () => {
    if (!root.current || typeof window === 'undefined') { return; }
      // Reduced motion: fully reveal without animation
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
        (root.current as HTMLElement).style.setProperty('--reveal', '100%');
        return;
      }
      const gsap = (await import('gsap')).default;
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
    (gsap as unknown as { registerPlugin: (p: unknown) => void }).registerPlugin(ScrollTrigger);
    const target = root.current;
    if (!target) { return; }
    gsap.to(target, {
        "--reveal": "100%",
        ease: "none",
        scrollTrigger: {
          trigger: target,
          start: "top bottom",
          end: "bottom bottom",
          scrub: true,
        }
      });
    })();
  }, []);
  return <footer ref={root} className="mask-reveal">{children}</footer>;
}
