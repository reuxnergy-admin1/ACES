"use client";
import { MotionConfig } from "framer-motion";
import { useEffect, useState, type ReactNode } from "react";
import { motionEase } from "@/lib/motion/tokens";

type ReducedMode = "user" | "always";

export default function MotionProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ReducedMode>("user");

  useEffect(() => {
    const read = (): ReducedMode => {
      try {
        const v = (typeof localStorage !== 'undefined') ? localStorage.getItem('motionMode') : null;
        return (v === 'always' || v === 'user') ? v : 'user';
      } catch { return 'user'; }
    };
    setMode(read());
    const onStorage = (e: StorageEvent) => { if (e.key === 'motionMode') setMode(read()); };
    const onCustom = () => setMode(read());
    window.addEventListener('storage', onStorage);
    window.addEventListener('motionmodechange', onCustom as EventListener);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('motionmodechange', onCustom as EventListener);
    };
  }, []);

  return (
    <MotionConfig reducedMotion={mode} transition={{ ease: motionEase.standard }}>
      {children}
    </MotionConfig>
  );
}
