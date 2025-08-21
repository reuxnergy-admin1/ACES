'use client';
import { useEffect } from 'react';
import Image from 'next/image';

export function Contours() {
  useEffect(() => {
    const layers = Array.from(document.querySelectorAll<HTMLElement>('.contour-layer'));
    const onScroll = () => {
      const y = window.scrollY;
      layers.forEach((el, i) => {
        const speed = (i + 1) * 0.05; // subtle
        el.style.transform = `translateY(${y * speed}px)`;
      });
    };
    if (!window.matchMedia('(prefers-reduced-motion)').matches) {
      window.addEventListener('scroll', onScroll, { passive: true });
    }
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="contour-host relative" aria-hidden="true">
      <Image className="contour-layer" src="/contours.svg" alt="" fill priority sizes="100vw" />
      <Image className="contour-layer" src="/contours-tight.svg" alt="" fill sizes="100vw" style={{opacity:0.10}} />
      <Image className="contour-layer" src="/contours.svg" alt="" fill sizes="100vw" style={{opacity:0.06}} />
    </div>
  );
}
