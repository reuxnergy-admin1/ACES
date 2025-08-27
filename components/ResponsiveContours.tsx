'use client';
import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { detectRenderer } from '@/lib/runtimeCaps';
import ContoursSVG from '@/components/ContoursSVG';
import BackgroundPortal from '@/components/BackgroundPortal';

// We'll decide at runtime whether to load WebGL chunk; start with null, then dynamic load when eligible
const DynamicIsolines = dynamic(() => import('@/components/ContoursIsolines'), {
  ssr: false,
  loading: () => null,
});

export default function ResponsiveContours() {
  const [mode, setMode] = useState<'svg' | 'webgl-low' | 'webgl-high' | null>(null);
  const [allowGL, setAllowGL] = useState(false);
  const [canUseGL, setCanUseGL] = useState(false);
  const idleHandle = useRef<number | null>(null);

  // Decide rendering mode quickly on mount
  useEffect(() => { setMode(detectRenderer()); }, []);

  // After deciding that WebGL is suitable, defer enabling it until the main thread is idle and only for fine pointer
  useEffect(() => {
    if (!mode || mode === 'svg') return;
    if (allowGL) return;
    const isReduced = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion)')?.matches;
    const fine = typeof window !== 'undefined' && window.matchMedia?.('(pointer: fine)')?.matches;
    if (isReduced) return; // safety
    // Always allow GL for background animation, but only start chunk load on idle; pointer type gates mouse interactivity
    setCanUseGL(Boolean(fine));

  const w = window as unknown as { requestIdleCallback?: (cb: () => void) => number; cancelIdleCallback?: (h: number) => void };
  const schedule: (cb: () => void) => number = w.requestIdleCallback ? w.requestIdleCallback.bind(w) : (cb) => window.setTimeout(cb, 120);
  idleHandle.current = schedule(() => setAllowGL(true));
    return () => {
      if (idleHandle.current != null) {
        if (w.cancelIdleCallback) {
          w.cancelIdleCallback(idleHandle.current);
        } else {
          clearTimeout(idleHandle.current);
        }
        idleHandle.current = null;
      }
    };
  }, [mode, allowGL]);

  // Immediate SVG background until GL is allowed and ready
  if (!allowGL || mode === 'svg' || mode === null) {
    return (
      <BackgroundPortal>
        <ContoursSVG />
      </BackgroundPortal>
    );
  }

  const base = {
    lineOpacity: 0.15,
    sigma: 0.26,
  };

  if (mode === 'webgl-high') {
    return (
      <BackgroundPortal>
        <DynamicIsolines
        density={24}
        lineWidth={0.014}
        intensity={0.7}
        sigma={base.sigma}
        lineOpacity={base.lineOpacity}
  dotRadiusUV={canUseGL ? 0.010 : 0.0}
  dotFeatherUV={canUseGL ? 0.006 : 0}
        showDotContinuously={false}
        />
      </BackgroundPortal>
    );
  }
  return (
    <BackgroundPortal>
      <DynamicIsolines
      density={22}
      lineWidth={0.015}
      intensity={0.55}
      sigma={0.28}
      lineOpacity={base.lineOpacity}
  dotRadiusUV={canUseGL ? 0.010 : 0.0}
  dotFeatherUV={canUseGL ? 0.006 : 0}
      showDotContinuously={false}
      />
    </BackgroundPortal>
  );
}
