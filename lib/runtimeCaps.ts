export const prefersReducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true;

export function detectRenderer(): 'svg' | 'webgl-low' | 'webgl-high' {
  if (prefersReducedMotion) return 'svg';

  // Data saver detection (Network Information API is experimental)
  let saveData = false;
  if (typeof navigator !== 'undefined' && 'connection' in navigator) {
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    saveData = !!connection?.saveData;
  }
  if (saveData) return 'svg';

  const coarse = typeof window !== 'undefined' && window.matchMedia?.('(pointer: coarse)').matches;
  let mem = 4;
  if (typeof navigator !== 'undefined' && 'deviceMemory' in navigator) {
    mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 4;
  }
  const cores = typeof navigator !== 'undefined' && 'hardwareConcurrency' in navigator
    ? navigator.hardwareConcurrency ?? 4
    : 4;

  let webglOK = false;
  try {
    const c = document.createElement('canvas');
    const gl = c.getContext('webgl') || c.getContext('experimental-webgl');
    webglOK = !!gl;
  } catch { webglOK = false; }

  if (!webglOK) return 'svg';
  if (!coarse && mem >= 4 && cores >= 4) return 'webgl-high';
  return 'webgl-low';
}
