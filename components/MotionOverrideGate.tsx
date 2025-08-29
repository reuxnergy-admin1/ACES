"use client";
import { useEffect } from 'react';

// Allows forcing motion even when the OS has reduced motion enabled.
// Activate via: ?motion=on or localStorage.setItem('motion','on')
export default function MotionOverrideGate() {
  useEffect(() => {
    const apply = () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const q = params.get('motion');
        const ls = (typeof localStorage !== 'undefined') ? localStorage.getItem('motion') : null;
        let on = q === 'on' || q === '1' || ls === 'on' || ls === '1';
        // In development, default to on for easier visual QA unless explicitly disabled
        if (!on && process.env.NODE_ENV !== 'production') on = true;
        if (on) {
          document.documentElement.setAttribute('data-motion-override', '1');
        } else {
          document.documentElement.removeAttribute('data-motion-override');
        }
      } catch { /* noop */ }
    };
    apply();
    window.addEventListener('storage', apply);
    return () => window.removeEventListener('storage', apply);
  }, []);
  return null;
}
