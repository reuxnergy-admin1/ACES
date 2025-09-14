"use client";
import { motion } from "framer-motion";
import { useInViewOnce } from "@/lib/motion/useInViewOnce";
import { motionDur, motionEase } from "@/lib/motion/tokens";
import clsx from "clsx";

type Dir = "up" | "down" | "left" | "right" | "none";

export default function Reveal({
  as: Tag = "div",
  children,
  className,
  dir = "up",
  distance = 16,
  delay = 0,
  duration = "sm",
  mask = true,
}: {
  as?: React.ElementType;
  children: React.ReactNode;
  className?: string;
  dir?: Dir;
  distance?: number;
  delay?: number;
  duration?: keyof typeof motionDur;
  mask?: boolean;
}) {
  const { ref, inView } = useInViewOnce<HTMLDivElement>();
  const translate = {
    up:   { y: distance },
    down: { y: -distance },
    left: { x: distance },
    right:{ x: -distance },
    none: {},
  }[dir];

  const Component = Tag as React.ComponentType<{ className?: string; children?: React.ReactNode; ref?: React.Ref<HTMLDivElement> }>;
  
  return (
    <Component ref={ref} className={clsx(mask && "overflow-hidden will-change-transform", className)}>
      <motion.div
        initial={{ opacity: 0, ...translate }}
        animate={inView ? { opacity: 1, x: 0, y: 0 } : undefined}
        transition={{ duration: motionDur[duration], delay, ease: motionEase.emphasis }}
      >
        {children}
      </motion.div>
    </Component>
  );
}