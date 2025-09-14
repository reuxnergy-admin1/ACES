"use client";
import { useEffect, useRef, useState } from "react";

export function useInViewOnce<T extends HTMLElement>(opts?: IntersectionObserverInit) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!ref.current || inView) return;
    if (!('IntersectionObserver' in window)) { setInView(true); return; }
    const ob = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          setInView(true);
          ob.disconnect();
        }
      });
    }, { rootMargin: "0px 0px -10% 0px", threshold: 0.15, ...opts });
    ob.observe(ref.current);
    return () => ob.disconnect();
  }, [inView, opts]);

  return { ref, inView } as const;
}
