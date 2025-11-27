"use client";
import { useEffect, useRef } from "react";

type Ripple = { x: number; y: number; t: number };

export default function CursorTrailOverlay() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const posRef = useRef({ x: -100, y: -100 });
  const lastPosRef = useRef({ x: -100, y: -100 });
  const hasMovedRef = useRef(false);
  const ripplesRef = useRef<Ripple[]>([]);
  const needsRenderRef = useRef(false);

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
    if (!ctx) return () => {};
    
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
      needsRenderRef.current = true;
    };
    resize();
    window.addEventListener("resize", resize, { passive: true });
    document.body.appendChild(canvas);

    const scheduleRender = () => {
      if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(render);
      }
    };
    
    // Initial render to show cursor immediately
    scheduleRender();

    const onMove = (e: PointerEvent) => {
      posRef.current = { x: e.clientX, y: e.clientY };
      needsRenderRef.current = true;
      if (!hasMovedRef.current) {
        hasMovedRef.current = true;
        document.body.classList.add('cursor-hidden');
      }
      scheduleRender();
    };
    
    const onPointerDown = (e: PointerEvent) => {
      if (isReducedMotion) return;
      
      const target = e.target as HTMLElement;
      if (target) {
        const tagName = target.tagName?.toLowerCase();
        const isTextElement = tagName === 'a' || tagName === 'button' || 
                              tagName === 'span' || tagName === 'p' || 
                              tagName === 'h1' || tagName === 'h2' || 
                              tagName === 'h3' || tagName === 'h4' || 
                              tagName === 'h5' || tagName === 'h6' ||
                              tagName === 'li' || tagName === 'label';
        const isNavOrLink = target.closest('a') || target.closest('button') || target.closest('nav');
        
        if (isTextElement || isNavOrLink) return;
      }
      
      ripplesRef.current.push({ x: e.clientX, y: e.clientY, t: performance.now() });
      if (ripplesRef.current.length > 3) ripplesRef.current.shift();
      needsRenderRef.current = true;
      scheduleRender();
    };
    
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onPointerDown, { passive: true });

    const rippleDurationMs = 350;
    const rippleMaxRadius = 60;

    const render = () => {
      rafRef.current = null;
      const now = performance.now();
      
      const prevRippleCount = ripplesRef.current.length;
      ripplesRef.current = ripplesRef.current.filter((r) => now - r.t <= rippleDurationMs);
      const hasActiveRipples = ripplesRef.current.length > 0;
      
      const { x, y } = posRef.current;
      const posChanged = x !== lastPosRef.current.x || y !== lastPosRef.current.y;
      lastPosRef.current = { x, y };
      
      if (!needsRenderRef.current && !posChanged && !hasActiveRipples && prevRippleCount === 0) {
        return;
      }
      
      needsRenderRef.current = false;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const ripple of ripplesRef.current) {
        const age = (now - ripple.t) / rippleDurationMs;
        const rx = Math.round(ripple.x * dpr) / dpr;
        const ry = Math.round(ripple.y * dpr) / dpr;
        
        for (let i = 0; i < 4; i++) {
          const delay = i * 0.08;
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

      if (x > 0 || y > 0) {
        ctx.fillStyle = 'rgba(255,255,255,0.94)';
        ctx.beginPath();
        ctx.arc(Math.round(x * dpr) / dpr, Math.round(y * dpr) / dpr, 5, 0, Math.PI * 2);
        ctx.fill();
      }

      if (hasActiveRipples) {
        rafRef.current = requestAnimationFrame(render);
      }
    };

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
