'use client';
import { createPortal } from 'react-dom';
import { useEffect, useState } from 'react';

export default function BackgroundPortal({ children }: { children: React.ReactNode }) {
  const [host, setHost] = useState<HTMLElement | null>(null);
  useEffect(() => { setHost(document.body); }, []);
  if (!host) return null;
  return createPortal(
  <div aria-hidden className="fixed inset-0 z-0">
      {children}
    </div>,
    host
  );
}
