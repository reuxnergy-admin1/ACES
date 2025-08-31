"use client";
import { useState, useEffect } from "react";
import { MotionConfig } from "framer-motion";
import { motionEase } from "@/lib/motion/tokens";

// Global state for motion toggle
let globalMotionEnabled = true;
let motionListeners: Array<(enabled: boolean) => void> = [];

export function setMotionEnabled(enabled: boolean) {
  globalMotionEnabled = enabled;
  motionListeners.forEach(listener => listener(enabled));
}

export function useMotionToggle() {
  const [motionEnabled, setMotionEnabledState] = useState(globalMotionEnabled);
  
  useEffect(() => {
    const listener = (enabled: boolean) => setMotionEnabledState(enabled);
    motionListeners.push(listener);
    return () => {
      motionListeners = motionListeners.filter(l => l !== listener);
    };
  }, []);
  
  return { motionEnabled, setMotionEnabled };
}

export default function MotionProvider({ children }: { children: React.ReactNode }) {
  const { motionEnabled } = useMotionToggle();
  
  return (
    <MotionConfig 
      reducedMotion={motionEnabled ? "user" : "always"} 
      transition={{ ease: motionEase.standard as [number, number, number, number] }}
    >
      {children}
    </MotionConfig>
  );
}