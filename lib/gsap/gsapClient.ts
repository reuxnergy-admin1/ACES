"use client";
import { useEffect, useRef } from "react";

type GSAPLike = {
  context?: (fn: () => void, scope?: unknown) => { revert?: () => void };
  timeline?: (opts?: unknown) => unknown;
  registerPlugin?: (plugin: unknown) => void;
};

export function useGSAP() {
  const gsapRef = useRef<GSAPLike | null>(null);
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (typeof window === "undefined" || gsapRef.current || cancelled) return;
  const gsap = (await import("gsap")).default as GSAPLike;
  const { ScrollTrigger } = await import("gsap/ScrollTrigger");
  gsap.registerPlugin?.(ScrollTrigger);
      if (!cancelled) gsapRef.current = gsap;
    })();
    return () => { cancelled = true; };
  }, []);
  return gsapRef;
}
