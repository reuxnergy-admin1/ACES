"use client";
import { useEffect } from 'react';

// Chronicle-like cursor dot with invert-on-hover for interactive elements,
// keeping our existing canvas trail.
// - Default: subtle ring around our canvas head
// - Over interactive targets: filled circle with mix-blend-mode:difference (invert)
export default function CursorDotOverlay() {
  useEffect(() => {
    const el = document.createElement('div');
    el.className = 'cursor-dot';
    el.setAttribute('aria-hidden', 'true');
    Object.assign(el.style, {
      position: 'fixed',
      left: '0px',
      top: '0px',
      transform: 'translate(-100px, -100px)', // off-screen until first move
      pointerEvents: 'none',
      zIndex: String(200001),
    });
    // Inner core for inversion fill
    const core = document.createElement('div');
    core.className = 'cursor-core';
    el.appendChild(core);
    document.body.appendChild(el);

  const SELECTOR = 'a[href], button, [role="button"], .button-primary, .button-solid, .button-ghost, .sheen-card, .chip, [data-interactive], input, textarea, select, summary, .link-underline';

    let lastX = 0, lastY = 0;
    const move = (e: PointerEvent) => {
      lastX = e.clientX; lastY = e.clientY;
      el.style.transform = `translate(${lastX}px, ${lastY}px)`;
      // Determine if we are over an interactive element
      const t = (e.target as Element | null);
      const hit = t?.closest?.(SELECTOR);
      const on = Boolean(hit);
      el.classList.toggle('is-invert', on);
      document.documentElement.classList.toggle('cursor-invert-on', on);
    };
    const leave = () => { el.style.opacity = '0'; };
    const enter = () => { el.style.opacity = ''; };

    // Hide dot during page wipe (body.cursor-hide-transition)
    const mo = new MutationObserver(() => {
      if (document.body.classList.contains('cursor-hide-transition')) {
        el.style.opacity = '0';
      } else {
        el.style.opacity = '';
      }
    });
    mo.observe(document.body, { attributes: true, attributeFilter: ['class'] });

    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('pointerleave', leave, { passive: true });
    window.addEventListener('pointerenter', enter, { passive: true });

    return () => {
      mo.disconnect();
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerleave', leave);
      window.removeEventListener('pointerenter', enter);
      el.remove();
      document.documentElement.classList.remove('cursor-invert-on');
    };
  }, []);
  return null;
}
