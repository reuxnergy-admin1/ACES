"use client";
import { useRouter } from "next/navigation";

export function useViewTransitionNav() {
  const router = useRouter();
  return (href: string) => {
    const start = (cb: () => void) => {
      try {
        if ('startViewTransition' in document) {
          (document as unknown as { startViewTransition: (cb: () => void) => void }).startViewTransition(cb);
          return;
        }
      } catch { /* noop */ }
      cb();
    };
    start(() => router.push(href));
  };
}
