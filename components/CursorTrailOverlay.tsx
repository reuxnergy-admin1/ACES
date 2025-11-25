"use client";
import { useEffect, useRef } from "react";

type Ripple = { x: number; y: number; t: number };

// A crisp, canvas-based cursor with a very short trail and click ripple effect.
// Cursor is white by default, turns black when over white card backgrounds (sheen cards with wipe active).
export default function CursorTrailOverlay() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastRef = useRef({ x: 0, y: 0, t: 0 });
  const pointsRef = useRef<Array<{x:number;y:number;t:number}>>([]);
  const activeRef = useRef(false);
  const darkModeRef = useRef(false);
  const ripplesRef = useRef<Ripple[]>([]);

  useEffect(() => {
    const isReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
    
    const canvas = document.createElement("canvas");
    canvasRef.current = canvas;
    Object.assign(canvas.style, {
      position: "fixed",
      inset: "0",
      pointerEvents: "none",
      zIndex: String(200000),
    });
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) {
      return () => {};
    }
    let dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));

    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);
    document.body.appendChild(canvas);

    let visible = true;
    const onMove = (e: PointerEvent) => {
      visible = true;
      const now = performance.now();
      const p = { x: e.clientX, y: e.clientY, t: now };
      lastRef.current = p;
      pointsRef.current.push(p);
      activeRef.current = true;
      
      // Check if cursor is over a sheen card that is currently wiped (hover/focus state)
      const target = e.target as HTMLElement | null;
      const sheenCard = target?.closest?.('.sheen-card');
      if (sheenCard) {
        const isHovered = sheenCard.matches(':hover') || sheenCard.matches(':focus-within');
        darkModeRef.current = isHovered;
      } else {
        darkModeRef.current = false;
      }
      
      if (rafRef.current == null) {
        rafRef.current = requestAnimationFrame(render);
      }
    };
    
    // Click ripple effect - centered on cursor position
    const onPointerDown = (e: PointerEvent) => {
      if (isReducedMotion) return;
      const now = performance.now();
      ripplesRef.current.push({ x: e.clientX, y: e.clientY, t: now });
      // Limit ripple pool to prevent memory buildup on rapid clicks
      if (ripplesRef.current.length > 5) {
        ripplesRef.current.shift();
      }
      activeRef.current = true;
      if (rafRef.current == null) {
        rafRef.current = requestAnimationFrame(render);
      }
    };
    
    const onLeave = () => {
      visible = false;
      activeRef.current = false;
      darkModeRef.current = false;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    window.addEventListener("pointerleave", onLeave, { passive: true });
    const onVis = () => {
      if (document.visibilityState === 'hidden') {
        activeRef.current = false;
      } else if (document.visibilityState === 'visible' && rafRef.current == null) {
        rafRef.current = requestAnimationFrame(render);
      }
    };
    document.addEventListener('visibilitychange', onVis);

    const maxTrailMs = 6;
    const rippleDurationMs = 600;
    const rippleMaxRadius = 80;

    const render = () => {
      const wipeHide = document.body.classList.contains('cursor-hide-transition');
      const now = performance.now();      
      pointsRef.current = wipeHide ? [] : pointsRef.current.filter((p) => now - p.t <= maxTrailMs);
      // Clean up expired ripples
      ripplesRef.current = ripplesRef.current.filter((r) => now - r.t <= rippleDurationMs);
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw ripples first (behind cursor) - use DPR-corrected coordinates
      if (!wipeHide) {
        const isDark = darkModeRef.current;
        const rippleColor = isDark ? '0,0,0' : '255,255,255';
        
        for (const ripple of ripplesRef.current) {
          const age = (now - ripple.t) / rippleDurationMs; // 0..1
          const easeOut = 1 - Math.pow(1 - age, 3);
          const radius = easeOut * rippleMaxRadius;
          const alpha = Math.max(0, 0.4 * (1 - age));
          
          // Apply DPR correction to ripple center coordinates
          const rx = Math.round(ripple.x * dpr) / dpr;
          const ry = Math.round(ripple.y * dpr) / dpr;
          
          // Draw 2 concentric rings
          for (let i = 0; i < 2; i++) {
            const ringRadius = radius - i * 12;
            if (ringRadius > 0) {
              const ringAlpha = alpha * (1 - i * 0.3);
              ctx.strokeStyle = `rgba(${rippleColor},${ringAlpha})`;
              ctx.lineWidth = 1.5;
              ctx.beginPath();
              ctx.arc(rx, ry, ringRadius, 0, Math.PI * 2);
              ctx.stroke();
            }
          }
        }
      }

      // Draw cursor and trail only when visible
      if (!wipeHide && visible && lastRef.current) {
        // Choose color based on dark mode
        const isDark = darkModeRef.current;
        const headColor = isDark ? 'rgba(0,0,0,0.94)' : 'rgba(255,255,255,0.94)';
        const trailColor = isDark ? '0,0,0' : '255,255,255';

        // Trail: draw tiny faded segments from oldest to newest
        const pts = pointsRef.current;
        for (let i = 1; i < pts.length; i++) {
          const p0 = pts[i - 1];
          const p1 = pts[i];
          const age = (now - p1.t) / maxTrailMs;
          const alpha = Math.max(0, 1 - age) * 0.35;
          ctx.strokeStyle = `rgba(${trailColor},${alpha})`;
          ctx.lineWidth = 1.0;
          const x0 = Math.round(p0.x * dpr) / dpr;
          const y0 = Math.round(p0.y * dpr) / dpr;
          const x1 = Math.round(p1.x * dpr) / dpr;
          const y1 = Math.round(p1.y * dpr) / dpr;
          ctx.beginPath();
          ctx.moveTo(x0, y0);
          ctx.lineTo(x1, y1);
          ctx.stroke();
        }

        // Head: draw cursor dot
        const { x, y } = lastRef.current;
        const r = 5.0;
        ctx.fillStyle = headColor;
        const ax = Math.round(x * dpr) / dpr;
        const ay = Math.round(y * dpr) / dpr;
        ctx.beginPath();
        ctx.arc(ax, ay, r, 0, Math.PI * 2);
        ctx.fill();
      }

      // Continue animation loop if there's any active content
      // Prioritize ripples to ensure they complete their animation even after pointer leaves
      const hasRipples = ripplesRef.current.length > 0;
      const hasCursorActivity = activeRef.current || pointsRef.current.length > 0;
      if (!wipeHide && (hasRipples || hasCursorActivity)) {
        rafRef.current = requestAnimationFrame(render);
      } else {
        rafRef.current = null;
      }
    };

    rafRef.current = requestAnimationFrame(render);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("resize", resize);
      document.removeEventListener('visibilitychange', onVis);
      canvas.remove();
      canvasRef.current = null;
    };
  }, []);

  return null;
}
