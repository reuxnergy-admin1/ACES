"use client";
import type { ReactNode } from "react";

export function Reveal({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className} data-reveal>
      {children}
    </div>
  );
}

export function RevealStagger({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className} data-reveal-stagger>
      {children}
    </div>
  );
}

export function RevealBlur({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className} data-reveal-blur>
      {children}
    </div>
  );
}

export function RevealBlurStagger({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className} data-reveal-blur-stagger>
      {children}
    </div>
  );
}
