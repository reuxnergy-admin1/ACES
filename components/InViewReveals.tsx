"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function InViewReveals() {
  const pathname = usePathname();
  useEffect(() => {
    const selector =
      "[data-reveal], [data-reveal-stagger], [data-reveal-blur], [data-reveal-blur-stagger]";
    const q = () =>
      Array.from(document.querySelectorAll<HTMLElement>(selector)).filter(
        (el) => !el.classList.contains("is-inview"),
      );
    let els = q();

    if (typeof window.IntersectionObserver === "undefined") {
      // Hard fallback if IO is unavailable
      q().forEach((el) => el.classList.add("is-inview"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            const t = e.target as HTMLElement;
            t.classList.add("is-inview");
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0 },
    );
    els.forEach((el) => io.observe(el));

    // Single deferred rescan for late content instead of multiple rescans + MutationObserver.
    // This dramatically reduces main-thread work.
    const rescan = () => {
      els = q();
      els.forEach((el) => io.observe(el));
    };
    const t1 = window.setTimeout(rescan, 500);

    // Hard fallback: force anything near viewport to visible after 3s
    const t2 = window.setTimeout(() => {
      q().forEach((el) => el.classList.add("is-inview"));
    }, 3000);

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      io.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return null;
}
