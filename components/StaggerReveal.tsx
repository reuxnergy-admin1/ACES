'use client';
import { useEffect, useRef } from 'react';

export default function StaggerReveal({ children, selector = '> *', delay = 80 }:{
  children: React.ReactNode;
  selector?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    if (window.matchMedia('(prefers-reduced-motion)').matches) return;
    const items = Array.from(root.querySelectorAll<HTMLElement>(selector));
    items.forEach((el) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(8px)';
      el.style.transition = 'opacity 200ms ease, transform 240ms ease';
    });
    const reveal = () => {
      items.forEach((el, i) => {
        const t = i * delay;
        el.style.transitionDelay = `${t}ms`;
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      });
    };
    const onEntries: IntersectionObserverCallback = (entries, ob) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          reveal();
          ob.disconnect();
          break;
        }
      }
    };
    const io = new IntersectionObserver(onEntries, { threshold: 0.12 });
    io.observe(root);
    return () => io.disconnect();
  }, [selector, delay]);
  return <div ref={ref}>{children}</div>;
}
