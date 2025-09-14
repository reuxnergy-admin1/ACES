"use client";
import { useEffect, useRef } from "react";

export function useGSAP() {
  const gsapRef = useRef<typeof import('gsap').default | null>(null);
  useEffect(() => {
    (async () => {
      if (typeof window === "undefined" || gsapRef.current) return;
      const gsap = (await import("gsap")).default;
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);
      gsapRef.current = gsap;
    })();
  }, []);
  return gsapRef;
}