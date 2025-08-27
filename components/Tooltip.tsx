"use client";
import { useEffect, useId, useRef, useState } from "react";
import clsx from "clsx";

type TooltipProps = {
  label: string;
  children: React.ReactElement;
  placement?: "top" | "bottom" | "left" | "right";
  delayMs?: number;
};

export function Tooltip({ label, children, placement = "top", delayMs = 120 }: TooltipProps) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const tRef = useRef<number | null>(null);
  const wrapRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => () => { if (tRef.current) clearTimeout(tRef.current); }, []);

  const show = () => {
    if (tRef.current) clearTimeout(tRef.current);
    tRef.current = window.setTimeout(() => setOpen(true), delayMs);
  };
  const hide = () => {
    if (tRef.current) clearTimeout(tRef.current);
    setOpen(false);
  };

  const offset = 10;
  const posClass = placement === "top" ? `bottom-full left-1/2 -translate-x-1/2 mb-[${offset}px]`
    : placement === "bottom" ? `top-full left-1/2 -translate-x-1/2 mt-[${offset}px]`
    : placement === "left" ? `right-full top-1/2 -translate-y-1/2 mr-[${offset}px]`
    : `left-full top-1/2 -translate-y-1/2 ml-[${offset}px]`;

  return (
    <span ref={wrapRef} className="relative inline-flex">
      <button
        type="button"
        aria-describedby={open ? id : undefined}
        className="contents"
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
  onBlur={hide}
  onKeyDown={(e) => { if (e.key === 'Escape') hide(); }}
      >
        {children}
      </button>
      <span
        id={id}
        role="tooltip"
  aria-hidden={open ? undefined : true}
        className={clsx(
          "pointer-events-none absolute z-overlay surface surface--sm surface-90 elevate rounded px-2 py-1 text-[11px] uc tracking-wide text-white/90 border border-white/12",
          "transition-[opacity,transform] duration-300 ease-[var(--ease-premium)]",
          open ? "opacity-100 scale-100" : "opacity-0 scale-95",
          posClass
        )}
      >
        {label}
      </span>
  </span>
  );
}
