"use client";
import { motion } from "framer-motion";
import { useInViewOnce } from "@/lib/motion/useInViewOnce";

export default function RevealGroup({
  children,
  stagger = 0.06,
  delay = 0,
}: { children: React.ReactNode; stagger?: number; delay?: number }) {
  const { ref, inView } = useInViewOnce<HTMLDivElement>();
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
      }}
    >
      {children}
    </motion.div>
  );
}