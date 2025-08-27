'use client';
import { useEffect, useState } from 'react';

export default function HardDebugBanner() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    try {
      const check = () => setShow(window.location.hash.includes('dbg-hard'));
      check();
      window.addEventListener('hashchange', check);
      return () => window.removeEventListener('hashchange', check);
    } catch { /* noop */ }
  }, []);
  if (!show) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 2147483647, pointerEvents: 'none' }} aria-hidden>
      <div style={{ position: 'absolute', top: 12, left: 12, background: 'rgba(255,0,128,0.95)', color: '#fff', padding: '8px 10px', borderRadius: 8, fontFamily: 'ui-monospace, Menlo, monospace', fontSize: 12 }}>
        HARD DEBUG BANNER (#dbg-hard)
      </div>
      <div style={{ position: 'absolute', bottom: 12, right: 12, background: 'rgba(255,0,128,0.95)', color: '#fff', padding: '8px 10px', borderRadius: 8, fontFamily: 'ui-monospace, Menlo, monospace', fontSize: 12 }}>
        If you can read this, new client bundle is active.
      </div>
    </div>
  );
}
