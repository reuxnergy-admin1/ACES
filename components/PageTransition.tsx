"use client";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

// Wraps content and triggers a subtle page fade on route change.
export default function PageTransition({ children }: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    // reference to satisfy dependency and intentionally re-run on route change
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  pathname && null;
    const el = ref.current;
    if (el) {
      el.classList.remove("page-fade");
      // force reflow to restart animation
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      el.offsetHeight; // read layout to flush
      el.classList.add("page-fade");
    }
  }, [pathname]);
  return (
    <div ref={ref} className="page-fade">
  {children}
    </div>
  );
}
