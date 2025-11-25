"use client";
import { useEffect, useRef } from "react";

// A crisp, canvas-based cursor with a very short trail.
// Inspired by https://codepen.io/ksenia-k/pen/rNoBgbV but simplified and shortened.
export default function CursorTrailOverlay() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastRef = useRef({ x: 0, y: 0, t: 0 });
  const pointsRef = useRef<Array<{x:number;y:number;t:number}>>([]);
  const activeRef = useRef(false);

  useEffect(() => {
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
      return () => {
        // nothing to clean up since we didn't attach
      };
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
      if (rafRef.current == null) {
        rafRef.current = requestAnimationFrame(render);
      }
    };
    const onLeave = () => {
      visible = false;
      activeRef.current = false;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave, { passive: true });
    const onVis = () => {
      if (document.visibilityState === 'hidden') {
        activeRef.current = false;
      } else if (document.visibilityState === 'visible' && rafRef.current == null) {
        rafRef.current = requestAnimationFrame(render);
      }
    };
    document.addEventListener('visibilitychange', onVis);

  // Slight trail tuned by time not frames; shorten further for minimal persistence
  const maxTrailMs = 6;
  // Simple exponential smoothing for ultra-smooth head movement
  // alpha is computed from a 90Hz baseline but scaled by frame dt
  // Removed unused lastTime variable

    const render = () => {
      // Respect page transition cursor hide
      const wipeHide = document.body.classList.contains('cursor-hide-transition');
      const now = performance.now();      
      // drop old points
      pointsRef.current = wipeHide ? [] : pointsRef.current.filter((p) => now - p.t <= maxTrailMs);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (!wipeHide && visible && lastRef.current) {
        // Trail: draw tiny faded segments from oldest to newest (extremely short)
        const pts = pointsRef.current;
        for (let i = 1; i < pts.length; i++) {
          const p0 = pts[i - 1];
          const p1 = pts[i];
          const age = (now - p1.t) / maxTrailMs; // 0..1
          const alpha = Math.max(0, 1 - age) * 0.35; // very subtle
          ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
          ctx.lineWidth = 1.0; // slightly wider to be closer to head size
          // Align line segments to device pixels to reduce blur
          const x0 = Math.round(p0.x * dpr) / dpr;
          const y0 = Math.round(p0.y * dpr) / dpr;
          const x1 = Math.round(p1.x * dpr) / dpr;
          const y1 = Math.round(p1.y * dpr) / dpr;
          ctx.beginPath();
          ctx.moveTo(x0, y0);
          ctx.lineTo(x1, y1);
          ctx.stroke();
        }

        // Head: always draw white cursor head
        const { x, y } = lastRef.current;
        const r = 5.0;
        ctx.fillStyle = 'rgba(255,255,255,0.94)';
        const ax = Math.round(x * dpr) / dpr;
        const ay = Math.round(y * dpr) / dpr;
        ctx.beginPath();
        ctx.arc(ax, ay, r, 0, Math.PI * 2);
        ctx.fill();
      }

      // Pause rAF if we have nothing to render to save CPU and match display cadence
      if (!wipeHide && (activeRef.current || pointsRef.current.length)) {
        rafRef.current = requestAnimationFrame(render); // Restart render loop on pointer movement
      } else {
        rafRef.current = null;
      }
    };

    rafRef.current = requestAnimationFrame(render);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("resize", resize);
  document.removeEventListener('visibilitychange', onVis);
      canvas.remove();
      canvasRef.current = null;
    };
  }, []);

  return null;
}
