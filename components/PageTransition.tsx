"use client";
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

type Coords = { x: number; y: number };

function colourForPath(): string {
  // Uniform black for premium minimalism
  return '#000000';
}

export default function PageTransition({ children }: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  const shellRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<SVGSVGElement>(null);
  const circleRef = useRef<SVGCircleElement>(null);
  const noiseRef = useRef<SVGFETurbulenceElement>(null);
  const ring1Ref = useRef<SVGCircleElement>(null);
  const ring2Ref = useRef<SVGCircleElement>(null);
  const ring3Ref = useRef<SVGCircleElement>(null);
  const dimRef = useRef<SVGRectElement>(null);
  const [, setIsActive] = useState(false);
  const animId = useRef(0);
  const clickPos = useRef<Coords | null>(null);
  const pendingColour = useRef<string>('#ffffff');

  // Animate content fade on enter; if overlay is active, shrink it to reveal content
  useEffect(() => {
    const el = shellRef.current;
    if (el) {
      el.classList.remove('page-fade');
      // force reflow
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      el.offsetHeight;
      el.classList.add('page-fade');
    }

    // If overlay is active (navigation occurred), shrink it to reveal content
    const ov = overlayRef.current;
    if (!ov) return;
    // Shrink overlay if currently active (dataset) — do not rely solely on state
    if (ov.dataset.active === '1') {
      // Small route-ready hold to finish the cover crescendo, then reveal
      const HOLD = 160; // allow reveal observers to arm before unveil
      const holdId = window.setTimeout(() => {
        // Animate circle radius back to 0 using JS for smoothness
        const circle = circleRef.current!;
        if (!circle) return;
        const startR = parseFloat(circle.getAttribute('r') || '0');
        const t0 = performance.now();
        const DUR = 1200;
        function ease(t: number) { return 1 - Math.pow(1 - t, 3); }
        const id = ++animId.current;
        function frame(t: number) {
          if (id !== animId.current) return;
          const p = Math.min(1, (t - t0) / DUR);
          const r = startR * (1 - ease(p));
          circle.setAttribute('r', String(r));
          if (p < 1) requestAnimationFrame(frame); else {
            const overlay = ov!;
            overlay.dataset.active = '0';
            overlay.style.pointerEvents = 'none';
            document.body.classList.remove('cursor-hide-transition');
            document.body.classList.remove('pt-disable-scroll');
            document.body.classList.remove('pt-no-events');
            setIsActive(false);
          }
        }
        requestAnimationFrame(frame);
      }, HOLD);
      return () => window.clearTimeout(holdId);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Global click capture to start overlay expand
  useEffect(() => {
    function preLock(e: PointerEvent) {
      // Pre-emptively engage locks on pointerdown for internal navigations for snappy feel
      const a = (e.target as Element | null)?.closest?.('a[href]') as HTMLAnchorElement | null;
      if (!a) return;
      const href = a.getAttribute('href') || '';
      if (!href.startsWith('/') || href.startsWith('/#')) return;
      document.body.classList.add('cursor-hide-transition');
      document.body.classList.add('pt-disable-scroll');
      document.body.classList.add('pt-no-events');
      // Activate overlay immediately so tests can observe it and users feel responsive
      const ov = overlayRef.current;
      const c = circleRef.current;
      if (ov && c && ov.dataset.active !== '1') {
        const x = (e as PointerEvent).clientX;
        const y = (e as PointerEvent).clientY;
        ov.dataset.active = '1';
        ov.dataset.phase = 'cover';
        c.setAttribute('cx', String(x));
        c.setAttribute('cy', String(y));
        c.setAttribute('r', '12');
        c.setAttribute('fill', colourForPath());
        const noise = noiseRef.current;
        if (noise) {
          noise.setAttribute('baseFrequency', '0.022');
          noise.setAttribute('seed', String(Math.floor(Math.random()*1000)));
        }
      }
    }
    function onClick(e: MouseEvent) {
      // If an animation is already active, ignore subsequent clicks
      if (overlayRef.current?.dataset.active === '1') return;
      // Ignore modified/new-tab clicks
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
      // Find nearest anchor
      const a = (e.target as Element | null)?.closest?.('a[href]') as HTMLAnchorElement | null;
      if (!a) return;
      const href = a.getAttribute('href') || '';
      // Internal links only
      if (!href.startsWith('/') || href.startsWith('/#')) return;
      // Start overlay
      const rect = a.getBoundingClientRect?.();
      // For header primary nav links, prefer a consistent bottom‑center origin for a composed brand move.
      const inHeaderNav = !!(a.closest('nav[aria-label="Primary"]'));
      const x = inHeaderNav ? window.innerWidth / 2 : (e.clientX || (rect ? rect.left + rect.width / 2 : window.innerWidth / 2));
      const y = inHeaderNav ? Math.max(0, window.innerHeight - 24) : (e.clientY || (rect ? rect.top + rect.height / 2 : window.innerHeight * 0.9));
      clickPos.current = { x, y };
      pendingColour.current = colourForPath();
      const ov = overlayRef.current;
      if (!ov) return;
      ov.style.pointerEvents = 'none';
      document.body.classList.add('cursor-hide-transition');
      document.body.classList.add('pt-disable-scroll');
      document.body.classList.add('pt-no-events');
      
      ov.dataset.active = '1';
      ov.dataset.phase = 'cover';
      const c = circleRef.current!; if (!c) return;
      const noise = noiseRef.current;
      c.setAttribute('cx', String(x));
      c.setAttribute('cy', String(y));
      c.setAttribute('r', '12');
      c.setAttribute('fill', pendingColour.current);
      // Init radar rings
      ;[ring1Ref.current, ring2Ref.current, ring3Ref.current].forEach((r)=>{ if(!r) return; r.setAttribute('cx', String(x)); r.setAttribute('cy', String(y)); r.setAttribute('r','0'); r.setAttribute('opacity','0'); });
      if (noise) {
        noise.setAttribute('baseFrequency', '0.022');
        noise.setAttribute('seed', String(Math.floor(Math.random()*1000)));
      }
      // Compute target radius to cover viewport
      const dx = Math.max(x, window.innerWidth - x);
      const dy = Math.max(y, window.innerHeight - y);
      const targetR = Math.sqrt(dx*dx + dy*dy) + 24;
      const t0 = performance.now();
      const DUR = 1200;
      function ease(t: number) { return 1 - Math.pow(1 - t, 3); }
      const id = ++animId.current;
      function frame(t: number) {
        if (id !== animId.current) return;
        const p = Math.min(1, (t - t0) / DUR);
        const r = 12 + (targetR - 12) * ease(p);
        c.setAttribute('r', String(r));
        // Keep noise stable for smoothness
        // Animate radar rings with gentle stagger
        const delays=[0,120,240];
        const rings=[ring1Ref.current, ring2Ref.current, ring3Ref.current];
        rings.forEach((ring,i)=>{ if(!ring) return; const td=Math.max(0,(performance.now()-(t0+delays[i]))/DUR); const pr=Math.min(1, td); const rr=12 + (targetR-12)*pr; const op=Math.max(0, 0.12*(1-pr)); ring.setAttribute('r', String(rr)); ring.setAttribute('opacity', String(op));});
        // Dimming polish: fade a subtle black scrim while the blob grows
        const dim = dimRef.current; if (dim) dim.setAttribute('opacity', String(Math.min(0.2, p*0.2)));
        if (p < 1) requestAnimationFrame(frame);
      }
      requestAnimationFrame(frame);
      // Fallback: if route does not change, auto-reveal after a short delay
      window.setTimeout(() => {
        if (ov.dataset.active === '1' && location.pathname === href) {
          // If we didn’t navigate, shrink back
          const circ = circleRef.current!; if (!circ) return;
          const startR = parseFloat(circ.getAttribute('r') || '0');
          const t0b = performance.now();
          const DURB = 900;
          function easeOut(t: number) { return 1 - Math.pow(1 - t, 3); }
          function f(t: number) {
            const p = Math.min(1, (t - t0b) / DURB);
            const r = startR * (1 - easeOut(p));
            circ.setAttribute('r', String(r));
            const dim = dimRef.current; if (dim) dim.setAttribute('opacity', String(Math.max(0, 0.2*(1-p))));
            if (p < 1) requestAnimationFrame(f); else { const overlay = ov!; overlay.dataset.active = '0'; overlay.style.pointerEvents = 'none'; if (dim) dim.setAttribute('opacity','0'); document.body.classList.remove('cursor-hide-transition'); document.body.classList.remove('pt-disable-scroll'); document.body.classList.remove('pt-no-events'); }
          }
          requestAnimationFrame(f);
        }
      }, 900);
    }
    document.addEventListener('pointerdown', preLock, true);
    document.addEventListener('click', onClick, true);
    return () => { document.removeEventListener('click', onClick, true); document.removeEventListener('pointerdown', preLock, true); };
  }, []);

  // Sync SVG viewBox to viewport for consistent geometry
  useEffect(() => {
    const ov = overlayRef.current;
    if (!ov) return;
    function setVB() { (ov as SVGSVGElement).setAttribute('viewBox', `0 0 ${window.innerWidth} ${window.innerHeight}`); }
    setVB();
    window.addEventListener('resize', setVB);
    return () => window.removeEventListener('resize', setVB);
  }, []);

  // Keep isActive flag in sync when overlay activates
  useEffect(() => {
    const ov = overlayRef.current;
    if (!ov) return;
    const obs = new MutationObserver(() => {
      setIsActive(ov.dataset.active === '1');
    });
    obs.observe(ov, { attributes: true, attributeFilter: ['data-active'] });
    return () => obs.disconnect();
  }, []);

  // Reverse wipe on browser back/forward (popstate)
  useEffect(() => {
    const handler = () => {
      if (!overlayRef.current || overlayRef.current.dataset.active === '1') return;
      const x = window.innerWidth / 2;
      const y = Math.max(0, window.innerHeight - 24);
      const ov = overlayRef.current;
      const c = circleRef.current!; if (!c) return;
      // Lock interaction
      document.body.classList.add('cursor-hide-transition');
      document.body.classList.add('pt-disable-scroll');
      document.body.classList.add('pt-no-events');
      ov.dataset.active = '1';
      c.setAttribute('cx', String(x));
      c.setAttribute('cy', String(y));
      c.setAttribute('r', '12');
      c.setAttribute('fill', '#000');
      const dx = Math.max(x, window.innerWidth - x);
      const dy = Math.max(y, window.innerHeight - y);
      const targetR = Math.sqrt(dx*dx + dy*dy) + 24;
      const t0 = performance.now();
      const DUR = 1000;
      function ease(t: number) { return 1 - Math.pow(1 - t, 3); }
      const id = ++animId.current;
      function frame(t: number) {
        if (id !== animId.current) return;
        const p = Math.min(1, (t - t0) / DUR);
        const r = 12 + (targetR - 12) * ease(p);
        c.setAttribute('r', String(r));
        if (p < 1) requestAnimationFrame(frame);
      }
      requestAnimationFrame(frame);
    };
    const opts: AddEventListenerOptions = { passive: true };
    window.addEventListener('popstate', handler as EventListener, opts);
    return () => window.removeEventListener('popstate', handler as EventListener, opts);
  }, []);

  return (
    <>
      <div ref={shellRef} className="page-fade">
        {children}
      </div>
      {/* Transition overlay (blob) */}
      <svg ref={overlayRef} className="pt-blob-svg" aria-hidden data-active="0" data-phase="idle" width="100%" height="100%" viewBox="0 0 1920 1080">
        <defs>
          <filter id="pt-blob-noise">
            <feTurbulence ref={(el: SVGFETurbulenceElement | null) => { noiseRef.current = el; }} type="fractalNoise" numOctaves="2" baseFrequency="0.02" />
            <feDisplacementMap in="SourceGraphic" scale="6" />
          </filter>
        </defs>
        {/* Dimming scrim (polish) */}
        <rect ref={dimRef} x="0" y="0" width="1920" height="1080" fill="#000" opacity="0" />
        <circle ref={circleRef} cx="0" cy="0" r="0" fill="#000" filter="url(#pt-blob-noise)" />
        <circle ref={ring1Ref} cx="0" cy="0" r="0" fill="none" stroke="#fff" strokeOpacity="0.12" strokeWidth="1" strokeDasharray="4 10" strokeLinecap="round" />
        <circle ref={ring2Ref} cx="0" cy="0" r="0" fill="none" stroke="#fff" strokeOpacity="0.12" strokeWidth="1" strokeDasharray="4 10" strokeLinecap="round" />
        <circle ref={ring3Ref} cx="0" cy="0" r="0" fill="none" stroke="#fff" strokeOpacity="0.12" strokeWidth="1" strokeDasharray="4 10" strokeLinecap="round" />
      </svg>
    </>
  );
}
