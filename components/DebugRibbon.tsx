'use client';
import { useEffect, useState } from 'react';

export default function DebugRibbon() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    try {
      const hash = window.location.hash;
      const ls = window.localStorage.getItem('bgDebug');
      if (hash.includes('debug-bg') || ls === '1') setVisible(true);
    } catch {/*noop*/}
  }, []);
  if (!visible) return null;
  return (
    <div style={{
      position: 'fixed', top: 8, left: 8, zIndex: 9999,
      background: 'rgba(0,0,0,0.8)', color: 'white',
      fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
      fontSize: 12, padding: '6px 8px', borderRadius: 6,
      border: '1px solid rgba(255,255,255,0.2)'
    }}>
      Debug ON (#debug-bg)
    </div>
  );
}
