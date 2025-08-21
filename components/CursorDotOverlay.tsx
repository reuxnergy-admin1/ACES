'use client';
import { useEffect, useRef, useState } from 'react';

export default function CursorDotOverlay() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const coarse = window.matchMedia?.('(pointer: coarse)').matches;
    let hideTO: ReturnType<typeof setTimeout> | undefined;
    const onMove = (e: PointerEvent) => {
      el.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      if (!coarse) setVisible(true);
      if (coarse) {
        setVisible(true);
        if (hideTO) clearTimeout(hideTO);
        hideTO = setTimeout(() => setVisible(false), 1200);
      }
    };
    const onLeave = () => setVisible(false);
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerleave', onLeave);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerleave', onLeave);
    };
  }, []);
  return (
    <div
      aria-hidden
      ref={ref}
  className="fixed top-0 left-0 z-overlay pointer-events-none"
      style={{ transform: 'translate(-100px,-100px)' }}
    >
      <div
        className="rounded-full"
        style={{
          width: 10,
          height: 10,
          background: 'white',
          opacity: visible ? 1 : 0,
          transition: 'opacity 200ms ease',
          willChange: 'transform, opacity',
        }}
      />
    </div>
  );
}
