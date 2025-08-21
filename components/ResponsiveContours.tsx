'use client';
import { useEffect, useState } from 'react';
import { detectRenderer } from '@/lib/runtimeCaps';
import ContoursIsolines from '@/components/ContoursIsolines';
import ContoursSVG from '@/components/ContoursSVG';
import BackgroundPortal from '@/components/BackgroundPortal';

export default function ResponsiveContours() {
  const [mode, setMode] = useState<'svg' | 'webgl-low' | 'webgl-high' | null>(null);

  useEffect(() => { setMode(detectRenderer()); }, []);

  if (mode === 'svg' || mode === null) {
    return (
      <BackgroundPortal>
        <ContoursSVG />
      </BackgroundPortal>
    );
  }

  const base = {
    lineOpacity: 0.10,
    sigma: 0.26,
  };

  if (mode === 'webgl-high') {
    return (
      <BackgroundPortal>
        <ContoursIsolines
        density={24}
        lineWidth={0.014}
        intensity={0.7}
        sigma={base.sigma}
        lineOpacity={base.lineOpacity}
        dotRadiusUV={0.010}
          dotFeatherUV={0}
        showDotContinuously
        />
      </BackgroundPortal>
    );
  }
  return (
    <BackgroundPortal>
      <ContoursIsolines
      density={22}
      lineWidth={0.015}
      intensity={0.55}
      sigma={0.28}
      lineOpacity={base.lineOpacity}
      dotRadiusUV={0.012}
  dotFeatherUV={0}
      showDotContinuously={false}
      />
    </BackgroundPortal>
  );
}
