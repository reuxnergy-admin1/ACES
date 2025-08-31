"use client";
import { MotionConfig } from "framer-motion";
import { motionEase } from "@/lib/motion/tokens";

export default function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user" transition={{ ease: motionEase.standard as [number, number, number, number] }}>
      {children}
    </MotionConfig>
  );
}