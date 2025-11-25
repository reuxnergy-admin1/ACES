"use client";
import { useEffect, useRef } from "react";

type Ripple = { x: number; y: number; t: number };

// A crisp, canvas-based cursor - always white, never disappears, instant tracking.
export default function CursorTrailOverlay() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const posRef = useRef({ x: -100, y: -100 }); // Start offscreen until first move
  const hasMovedRef = useRef(false);
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

    // Track mouse position directly - no smoothing for instant response
    const onMove = (e: PointerEvent) => {
      posRef.current = { x: e.clientX, y: e.clientY };
      // Hide native cursor only after first movement (so users always see a cursor)
      if (!hasMovedRef.current) {
        hasMovedRef.current = true;
        document.body.classList.add('cursor-hidden');
      }
    };
    
    // Click ripple effect - centered on cursor position, snappy and responsive
    const onPointerDown = (e: PointerEvent) => {
      if (isReducedMotion) return;
      const now = performance.now();
      ripplesRef.current.push({ x: e.clientX, y: e.clientY, t: now });
      if (ripplesRef.current.length > 3) {
        ripplesRef.current.shift();
      }
    };
    
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onPointerDown, { passive: true });

    // Faster ripple for snappier clicks
    const rippleDurationMs = 350;
    const rippleMaxRadius = 60;

    // Continuous render loop - never stops, cursor always visible
    const render = () => {
      const now = performance.now();
      
      // Clean up expired ripples
      ripplesRef.current = ripplesRef.current.filter((r) => now - r.t <= rippleDurationMs);
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw ripples first (behind cursor) - always white, 4 concentric circles per click
      for (const ripple of ripplesRef.current) {
        const age = (now - ripple.t) / rippleDurationMs;
        const easeOut = 1 - Math.pow(1 - age, 2.5);
        
        const rx = Math.round(ripple.x * dpr) / dpr;
        const ry = Math.round(ripple.y * dpr) / dpr;
        
        // Draw 4 concentric ripple circles with staggered timing
        const circleCount = 4;
        for (let i = 0; i < circleCount; i++) {
          const delay = i * 0.08; // Stagger each circle
          const circleAge = Math.max(0, age - delay);
          if (circleAge <= 0) continue;
          
          const circleEase = 1 - Math.pow(1 - Math.min(circleAge / (1 - delay), 1), 2.5);
          const radius = circleEase * (rippleMaxRadius + i * 15);
          const alpha = Math.max(0, (0.5 - i * 0.1) * (1 - circleAge / (1 - delay)));
          
          ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
          ctx.lineWidth = 1.5 - i * 0.2;
          ctx.beginPath();
          ctx.arc(rx, ry, radius, 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      // Draw cursor dot - always white, always visible
      const { x, y } = posRef.current;
      if (x > 0 || y > 0) {
        const r = 5.0;
        ctx.fillStyle = 'rgba(255,255,255,0.94)';
        const ax = Math.round(x * dpr) / dpr;
        const ay = Math.round(y * dpr) / dpr;
        ctx.beginPath();
        ctx.arc(ax, ay, r, 0, Math.PI * 2);
        ctx.fill();
      }

      // Continuous animation loop - never stops
      rafRef.current = requestAnimationFrame(render);
    };

    rafRef.current = requestAnimationFrame(render);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("resize", resize);
      canvas.remove();
      canvasRef.current = null;
      document.body.classList.remove('cursor-hidden');
    };
  }, []);

  return null;
}
