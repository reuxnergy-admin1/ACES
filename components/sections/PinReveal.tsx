"use client";
import { useEffect, useRef } from "react";
import { useGSAP } from "@/lib/gsap/gsapClient";

export default function PinReveal({ children }: { children: React.ReactNode }) {
  const gsapRef = useGSAP();
  const root = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const gsap = gsapRef.current;
    if (!gsap || !root.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current!,
          start: "top top",
          end: "bottom+=100% top",
          scrub: 0.5,
          pin: true,
          anticipatePin: 1,
        }
      });

      // stagger child elements with data attributes
      tl.fromTo("[data-step='1']", { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, 0.1)
        .fromTo("[data-step='2']", { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, 0.35)
        .fromTo("[data-step='3']", { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, 0.6);
    }, root);

    return () => ctx.revert();
  }, [gsapRef]);

  return <section ref={root} className="relative">{children}</section>;
}