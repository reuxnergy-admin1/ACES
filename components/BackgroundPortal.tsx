// IMPORTANT: Portal host for background layers. Do not change stacking or positioning without verifying
// header/content interaction and pointer-events pass-through.
'use client';
import { createPortal } from 'react-dom';
import { useEffect, useState } from 'react';

export default function BackgroundPortal({ children }: { children: React.ReactNode }) {
  const [host, setHost] = useState<HTMLElement | null>(null);
  useEffect(() => { setHost(document.body); }, []);
  if (!host) return null;
  return createPortal(
    <div aria-hidden="true" data-vrt-mask className="fixed inset-0 z-bg pointer-events-none">
      {children}
    </div>,
    host
  );
}
