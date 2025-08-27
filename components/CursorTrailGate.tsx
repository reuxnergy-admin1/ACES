'use client';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const DynamicTrail = dynamic(() => import('./CursorTrailOverlay'), {
  ssr: false,
  loading: () => null,
});

export default function CursorTrailGate() {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    const mqFine = window.matchMedia?.('(pointer: fine)');
    const mqReduced = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    const compute = () => Boolean(mqFine?.matches && !mqReduced?.matches);
    const apply = () => {
      const ok = compute();
      setEnabled(ok);
      document.body.classList.toggle('cursor-hidden', ok);
      document.documentElement.style.setProperty('--cursor-enabled', ok ? '1' : '0');
    };
    apply();
    const onChange = () => apply();
    mqFine?.addEventListener?.('change', onChange);
    mqReduced?.addEventListener?.('change', onChange);
    return () => {
      mqFine?.removeEventListener?.('change', onChange);
      mqReduced?.removeEventListener?.('change', onChange);
      document.body.classList.remove('cursor-hidden');
      document.documentElement.style.removeProperty('--cursor-enabled');
    };
  }, []);
  if (!enabled) return null;
  return <DynamicTrail />;
}
