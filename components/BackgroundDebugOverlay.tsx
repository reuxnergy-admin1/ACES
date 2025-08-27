'use client';
import { useEffect, useState } from 'react';

declare global {
  interface Window {
    __bg?: {
      lastX?: number;
      lastY?: number;
      uMouseX?: number;
      uMouseY?: number;
      mode?: string;
      allowGL?: boolean;
      canUseGL?: boolean;
      rippleActive?: number;
    };
  }
}

function useDebugFlag() {
  const [debug, setDebug] = useState(false);
  useEffect(() => {
    try {
      const hash = typeof window !== 'undefined' ? window.location.hash : '';
      const ls = typeof window !== 'undefined' ? window.localStorage.getItem('bgDebug') : null;
      const env = process.env.NEXT_PUBLIC_BG_DEBUG;
  const on = !!(hash?.includes('debug-bg') || ls === '1' || env === '1');
      setDebug(on);
    } catch { setDebug(false); }
  }, []);
  return debug;
}

export default function BackgroundDebugOverlay() {
  const debug = useDebugFlag();
  const [_tick, setTick] = useState(0);
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.log('[BG] BackgroundDebugOverlay mounted');
    }
    if (!debug) return;
    const id = window.setInterval(() => setTick((n) => (n + 1) % 1000), 100);
    return () => window.clearInterval(id);
  }, [debug]);
  if (!debug) return null;
  const info = typeof window !== 'undefined' ? window.__bg : undefined;
  const umx = info?.uMouseX ?? -1;
  const umy = info?.uMouseY ?? -1;
  const dotStyle: React.CSSProperties = umx >= 0 && umy >= 0 ? {
    position: 'fixed',
    left: `${umx * 100}%`,
    top: `${(1 - umy) * 100}%`,
    transform: 'translate(-50%, -50%)',
    width: 8,
    height: 8,
    borderRadius: '50%',
    background: 'lime',
    zIndex: 9999,
    pointerEvents: 'none'
  } : { display: 'none' };
  return (
    <>
  <div data-tick={_tick % 2 ? '1' : '0'} style={{
        position: 'fixed', right: 8, bottom: 8, zIndex: 200000,
        background: 'rgba(0,0,0,0.85)', color: '#0f0',
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
        fontSize: 12, padding: '8px 10px', border: '1px solid rgba(0,255,0,0.3)', borderRadius: 6,
        pointerEvents: 'auto'
      }}>
        <div><strong>BG Debug</strong></div>
        <div>mode: {info?.mode ?? 'n/a'}</div>
        <div>allowGL: {String(info?.allowGL)}</div>
        <div>canUseGL: {String(info?.canUseGL)}</div>
        <div>last: {Math.round(info?.lastX ?? -1)}, {Math.round(info?.lastY ?? -1)}</div>
        <div>u_mouse: {info?.uMouseX?.toFixed(3) ?? '-'}, {info?.uMouseY?.toFixed(3) ?? '-'}</div>
        <div>ripple: {info?.rippleActive ?? 0}</div>
        <div style={{opacity: 0.7}}>hash #debug-bg or localStorage bgDebug=1</div>
      </div>
  <div style={{...dotStyle, zIndex: 200001}} aria-hidden />
    </>
  );
}
