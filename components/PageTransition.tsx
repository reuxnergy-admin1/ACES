"use client";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

// Wraps content and triggers a subtle page fade on route change.
export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    // reference pathname to satisfy lint and intentionally re-run on route change
    void pathname;
    const el = ref.current;
    if (el) {
      el.classList.remove("page-fade");
      // force reflow to restart animation
      void el.offsetWidth;
      el.classList.add("page-fade");
    }
  }, [pathname]);
  return (
    <div ref={ref} className="page-fade">
      {children}
    </div>
  );
}
