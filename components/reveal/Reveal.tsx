"use client";
import { motion } from "framer-motion";
import { useInViewOnce } from "@/lib/motion/useInViewOnce";
import { motionDur, motionEase } from "@/lib/motion/tokens";
import clsx from "clsx";
import { createElement, type ElementType, type ComponentPropsWithoutRef } from "react";

type Dir = "up" | "down" | "left" | "right" | "none";

type Props<T extends ElementType> = {
  as?: T;
  children: React.ReactNode;
  className?: string;
  dir?: Dir;
  distance?: number;
  delay?: number;
  duration?: keyof typeof motionDur;
  mask?: boolean;
} & Omit<ComponentPropsWithoutRef<T>, "children" | "className">;

export default function Reveal<T extends ElementType>({
  as,
  children,
  className,
  dir = "up",
  distance = 16,
  delay = 0,
  duration = "sm",
  mask = true,
  ...rest
}: Props<T>) {
  const { ref, inView } = useInViewOnce<HTMLDivElement>();
  const translate = {
    up:   { y: distance },
    down: { y: -distance },
    left: { x: distance },
    right:{ x: -distance },
    none: {},
  }[dir];

  const Tag = (as ?? "div") as ElementType;
  return createElement(
    Tag,
    { ref, className: clsx(mask && "overflow-hidden will-change-transform", className), ...rest },
    <motion.div
      style={{ backfaceVisibility: 'hidden', willChange: 'opacity, transform' }}
      initial={{ opacity: 0, ...(translate as Record<string, number>) }}
      animate={inView ? { opacity: 1, x: 0, y: 0 } : undefined}
      transition={{ duration: motionDur[duration], delay, ease: motionEase.emphasis as unknown as [number, number, number, number] }}
    >
      {children}
    </motion.div>
  );
}
