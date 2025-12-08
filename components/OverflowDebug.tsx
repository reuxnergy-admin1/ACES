"use client";
import { useEffect, useState } from "react";

export default function OverflowDebug() {
  const [enabled, setEnabled] = useState(false);
  const [metrics, setMetrics] = useState<{
    docW: number;
    vw: number;
    culprit?: string;
  } | null>(null);
  useEffect(() => {
    // Allow debug in both dev and prod, but only when explicitly enabled
    const hashOn =
      typeof window !== "undefined" &&
      window.location.hash.includes("debug-overflow");
    const pathOn =
      typeof window !== "undefined" &&
      window.location.pathname.includes("debug-overflow");
    const qs =
      typeof window !== "undefined"
        ? new URLSearchParams(window.location.search)
        : null;
    const qsOn = !!(
      qs?.has("debug-overflow") || qs?.get("overflowDebug") === "1"
    );
    const lsOn =
      typeof window !== "undefined" &&
      window.localStorage.getItem("overflowDebug") === "1";
    const envOn = process.env.NEXT_PUBLIC_OVERFLOW_DEBUG === "1";
    const on = hashOn || pathOn || qsOn || lsOn || envOn;
    if (!on) return;
    setEnabled(true);
    const style = document.createElement("style");
    style.dataset.overflowDebug = "1";
    style.textContent = `
      * { outline: 1px solid transparent; }
      .__overflow-clip__ { pointer-events: none; }
      @keyframes __blink__ { 50% { outline-color: rgba(255,0,0,.35); } }
      body.__overflow-debug__ *:not(html):not(body) {
        outline-offset: -1px;
      }
      [data-overflow-culprit="1"] { outline: 1px solid rgba(255,0,0,.55) !important; }
    `;
    document.head.appendChild(style);
    const check = () => {
      document.body.classList.add("__overflow-debug__");
      document.querySelectorAll("[data-overflow-culprit]").forEach((el) => {
        (el as HTMLElement).removeAttribute("data-overflow-culprit");
      });
      const doc = document.documentElement;
      const w = Math.max(doc.scrollWidth, doc.clientWidth);
      const vw = window.innerWidth;
      if (w <= vw + 1) {
        // allow 1px tolerance
        setMetrics({ docW: w, vw });
        return;
      }
      // mark widest elements
      let maxEl: Element | null = null;
      let max = vw;
      document.querySelectorAll("*").forEach((el) => {
        const r = (el as HTMLElement).getBoundingClientRect?.();
        if (!r) return;
        const exceeds = r.left < 0 || r.right > vw;
        if (exceeds && r.width > max) {
          max = r.width;
          maxEl = el;
        }
      });
      if (maxEl) {
        (maxEl as HTMLElement).setAttribute("data-overflow-culprit", "1");
        const name = (maxEl as HTMLElement).tagName.toLowerCase();
        const cls = (maxEl as HTMLElement).className?.toString?.() ?? "";
        const clsShort = cls
          ? "." + cls.toString().split(/\s+/).slice(0, 3).join(".")
          : "";
        setMetrics({ docW: w, vw, culprit: `${name}${clsShort}` });
      } else {
        setMetrics({ docW: w, vw });
      }
    };
    const ro = new ResizeObserver(check);
    ro.observe(document.documentElement);
    window.addEventListener("hashchange", check);
    window.addEventListener("resize", check);
    window.addEventListener("orientationchange", check);
    requestAnimationFrame(check);
    return () => {
      ro.disconnect();
      window.removeEventListener("hashchange", check);
      window.removeEventListener("resize", check);
      window.removeEventListener("orientationchange", check);
      style.remove();
      document.body.classList.remove("__overflow-debug__");
      setEnabled(false);
      setMetrics(null);
    };
  }, []);
  if (!enabled) return null;
  return (
    <div
      style={{
        position: "fixed",
        top: 8,
        left: 8,
        zIndex: 2147483000,
        background: "rgba(0,0,0,0.85)",
        color: "#fff",
        border: "1px solid rgba(255,255,255,0.25)",
        borderRadius: 8,
        padding: "6px 8px",
        fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
        fontSize: 12,
        pointerEvents: "none",
      }}
      aria-hidden
    >
      <div>
        <strong>Overflow Debug</strong> (hash, path, query or localStorage)
      </div>
      {metrics ? (
        <div>
          w: {metrics.docW}px • vw: {metrics.vw}px{" "}
          {metrics.culprit ? `• culprit: ${metrics.culprit}` : ""}
        </div>
      ) : null}
    </div>
  );
}
