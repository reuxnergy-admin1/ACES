'use client';
import { useEffect } from 'react';

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
    <div className="contour-host" aria-hidden="true">
      <img className="contour-layer" src="/contours.svg" alt="" />
      <img className="contour-layer" style={{opacity:0.10}} src="/contours-tight.svg" alt="" />
      <img className="contour-layer" style={{opacity:0.06}} src="/contours.svg" alt="" />
    </div>
  );
}
