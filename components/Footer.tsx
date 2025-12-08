"use client";
import Link from "next/link";
import { Span } from "@/components/layout/Grid12";
import { useEffect, useRef } from "react";
import { SocialIcons } from "@/components/SocialIcons";

export function Footer() {
  const ref = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) return;
    const onMove = (e: PointerEvent) => {
      const y = e.clientY;
      const bottomDist = Math.max(0, window.innerHeight - y);
      const thresh = 240;
      const alpha = Math.max(0, Math.min(1, (thresh - bottomDist) / thresh));
      document.documentElement.style.setProperty(
        "--footer-alpha",
        String(alpha),
      );
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);
  return (
    <footer ref={ref} className="relative">
      <div className="footer-sheen" aria-hidden="true" />
      <div className="grid-shell">
        <div className="container-wide py-16 grid-12 gutter text-sm text-white/70">
          <Span cols={4}>
            <div className="text-white uc tracking-wider">
              ACES Aerodynamics
            </div>
            <div className="mt-4">
              <div className="text-white/60 text-xs uc tracking-wider mb-1">
                Email
              </div>
              <a
                href="mailto:info@acesaerodynamics.com"
                className="link-underline text-white/80 hover:text-white"
              >
                info@acesaerodynamics.com
              </a>
            </div>
            <div className="mt-3">
              <div className="text-white/60 text-xs uc tracking-wider mb-1">
                WhatsApp
              </div>
              <a
                className="link-underline text-white/80 hover:text-white"
                href="https://wa.me/27828935583"
                target="_blank"
                rel="noopener noreferrer"
              >
                +27 82 893 5583
              </a>
            </div>
            <div className="mt-3">
              <div className="text-white/60 text-xs uc tracking-wider mb-1">
                Address
              </div>
              <a
                className="link-underline text-white/80 hover:text-white"
                href="https://maps.app.goo.gl/5vdLTXqJNcxudLCBA"
                target="_blank"
                rel="noopener noreferrer"
              >
                5 Industria Street,
                <br />
                Potchindustria,
                <br />
                Potchefstroom,
                <br />
                2520
              </a>
            </div>
          </Span>
          <Span cols={4}>
            <div className="uc tracking-wider text-white/60 text-xs">
              Company
            </div>
            <div className="mt-2 space-y-2">
              <a
                className="link-underline text-white/85 hover:text-white block"
                href="/about/"
              >
                About
              </a>
              <a
                className="link-underline text-white/85 hover:text-white block"
                href="/products/"
              >
                Products and Services
              </a>
              <a
                className="link-underline text-white/85 hover:text-white block"
                href="/blog/"
              >
                Insights
              </a>
            </div>
          </Span>
          <Span cols={4}>
            <div className="uc tracking-wider text-white/60 text-xs">
              Follow
            </div>
            <div className="mt-3">
              <SocialIcons />
            </div>
          </Span>
          <Span cols={12}>
            <div className="mt-10 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-white/50">
              <div className="text-white/50">
                © ACES Plastics CC t/a ACES Aerodynamics
              </div>
              <div>
                <Link
                  href="#main-content"
                  className="link-underline text-white/70 hover:text-white"
                >
                  Back to top
                </Link>
              </div>
            </div>
          </Span>
        </div>
      </div>
    </footer>
  );
}
