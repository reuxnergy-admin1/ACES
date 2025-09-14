"use client";
import { useEffect } from 'react';

export default function ScrollResetOnLoad() {
  useEffect(() => {
    const reset = () => {
      try {
  // Use auto to avoid smooth during tests and reduced motion contexts
  window.scrollTo({ top: 0, behavior: 'auto' });
      } catch {
        window.scrollTo(0, 0);
      }
    };
    // Initial load
    reset();
    // Rely on our router-driven navigation; PageTransition calls router.push
    // Also reset on browser back/forward
    window.addEventListener('popstate', reset, { passive: true } as AddEventListenerOptions);
    return () => window.removeEventListener('popstate', reset as EventListener);
  }, []);
  return null;
}
