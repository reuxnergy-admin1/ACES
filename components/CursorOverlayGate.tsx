'use client';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Split the heavy overlay into its own chunk and only load when needed
const DynamicCursorOverlay = dynamic(() => import('./CursorDotOverlay'), {
  ssr: false,
  loading: () => null,
});

export default function CursorOverlayGate() {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    const isReduced = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
    const fine = window.matchMedia?.('(pointer: fine)')?.matches;
    // Only enable on fine pointers and when motion is not reduced
    setEnabled(Boolean(fine && !isReduced));
  }, []);
  if (!enabled) return null;
  return <DynamicCursorOverlay />;
}
