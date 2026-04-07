import type { ReactNode } from "react";

type Props = Readonly<{
  children: ReactNode;
  className?: string;
}>;

// Inversion wipe card: no per-mousemove highlight; pure CSS-driven left-to-right wipe.
export default function SheenCard({ children, className = "" }: Props) {
  // Rely on CSS-only wipe from globals.css; no JS/hydration needed
  return <div className={`sheen-card ${className}`}>{children}</div>;
}
