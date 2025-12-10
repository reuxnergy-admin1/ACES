// IMPORTANT: Background rendering stack (responsive SVG→WebGL). This file is performance- and stability-sensitive.
// Please avoid edits without reviewing with the code owner. If you must change it, run `npm run guard:bg:update` to refresh
// the background integrity hashes after the change, and manually verify in the browser. See scripts/bg-guard.mjs.
"use client";
import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { detectRenderer } from "@/lib/runtimeCaps";
import ContoursSVG from "@/components/ContoursSVG";
import BackgroundPortal from "@/components/BackgroundPortal";

// We'll decide at runtime whether to load WebGL chunk; start with null, then dynamic load when eligible
const DynamicIsolines = dynamic(() => import("@/components/ContoursIsolines"), {
  ssr: false,
  loading: () => null,
});

export default function ResponsiveContours() {
  const [mode, setMode] = useState<"svg" | "webgl-low" | "webgl-high" | null>(
    null,
  );
  const [allowGL, setAllowGL] = useState(false);
  const [canUseGL, setCanUseGL] = useState(false);
  const [debugOn, setDebugOn] = useState(false);
  const idleHandle = useRef<number | null>(null);

  // Decide rendering mode quickly on mount, allow hash overrides for debugging
  useEffect(() => {
    const detected = detectRenderer();
    let desired: typeof detected = detected;
    try {
      const hash = typeof window !== "undefined" ? window.location.hash : "";
      if (hash.includes("force-gl")) desired = "webgl-high";
      if (hash.includes("force-svg")) desired = "svg";
    } catch {
      /* noop */
    }
    setMode(desired);
    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.info("[BG] detectRenderer ->", detected, "override ->", desired);
    }
  }, []);

  // After deciding that WebGL is suitable, defer enabling it until the main thread is idle and only for fine pointer (but do not block GL entirely on reduced-motion)
  useEffect(() => {
    if (!mode || mode === "svg") return;
    if (allowGL) return;
    // If forced GL via hash, enable immediately
    const hash = typeof window !== "undefined" ? window.location.hash : "";
    if (hash.includes("force-gl")) {
      setCanUseGL(true);
      setAllowGL(true);
      return;
    }
    const fine =
      typeof window !== "undefined" &&
      window.matchMedia?.("(pointer: fine)")?.matches;
    // Allow GL and enable cursor-driven interactivity on fine pointers
    setCanUseGL(Boolean(fine));

    const w = window as unknown as {
      requestIdleCallback?: (cb: () => void) => number;
      cancelIdleCallback?: (h: number) => void;
    };
    const schedule: (cb: () => void) => number = w.requestIdleCallback
      ? w.requestIdleCallback.bind(w)
      : (cb) => window.setTimeout(cb, 120);
    idleHandle.current = schedule(() => setAllowGL(true));
    return () => {
      if (idleHandle.current != null) {
        if (w.cancelIdleCallback) {
          w.cancelIdleCallback(idleHandle.current);
        } else {
          clearTimeout(idleHandle.current);
        }
        idleHandle.current = null;
      }
    };
  }, [mode, allowGL]);

  // Expose debug flags for overlay
  useEffect(() => {
    if (typeof window === "undefined") return;
    window.__bg = window.__bg || {};
    Object.assign(window.__bg, { mode, allowGL, canUseGL });
  }, [mode, allowGL, canUseGL]);

  // Mark when GL is active to allow CSS to fade out the SVG fallback
  useEffect(() => {
    if (!allowGL) return;
    document.body.classList.add("bg-gl-ready");
    return () => document.body.classList.remove("bg-gl-ready");
  }, [allowGL]);

  // Debug toggle (only when explicitly enabled via hash/localStorage)
  useEffect(() => {
    try {
      const hash = window.location.hash;
      const ls = window.localStorage.getItem("bgDebug");
      const on = hash.includes("debug-bg") || ls === "1";
      setDebugOn(on);
    } catch {
      setDebugOn(false);
    }
  }, []);

  // Immediate SVG background until GL is allowed and ready
  if (!allowGL || mode === "svg" || mode === null) {
    return (
      <BackgroundPortal>
        <ContoursSVG />
      </BackgroundPortal>
    );
  }

  const base = {
    lineOpacity: 0.35,
    sigma: 0.28,
  };

  if (mode === "webgl-high") {
    // Disable shader dot by default; only enable when debug UI is on
    const dotR = 0.0; // keep shader dot disabled to avoid double-cursor
    const dotF = 0.0;
    return (
      <BackgroundPortal>
        <DynamicIsolines
          density={debugOn ? 24 : 22}
          lineWidth={debugOn ? 0.018 : 0.016}
          intensity={debugOn ? 0.9 : 0.7}
          sigma={debugOn ? 0.26 : 0.3}
          lineOpacity={debugOn ? 0.28 : base.lineOpacity}
          dotRadiusUV={dotR}
          dotFeatherUV={dotF}
          showDotContinuously={false}
        />
      </BackgroundPortal>
    );
  }
  // Disable shader dot by default in low mode as well
  const dotR = 0.0;
  const dotF = 0.0;
  return (
    <BackgroundPortal>
      <DynamicIsolines
        density={debugOn ? 22 : 20}
        lineWidth={debugOn ? 0.018 : 0.016}
        intensity={debugOn ? 0.8 : 0.6}
        sigma={debugOn ? 0.28 : 0.3}
        lineOpacity={debugOn ? 0.28 : base.lineOpacity}
        dotRadiusUV={dotR}
        dotFeatherUV={dotF}
        showDotContinuously={false}
      />
    </BackgroundPortal>
  );
}
