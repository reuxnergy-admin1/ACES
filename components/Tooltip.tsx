"use client";
import { useEffect, useId, useRef, useState, cloneElement } from "react";
import clsx from "clsx";

type TooltipChildProps = React.HTMLAttributes<HTMLElement> &
  React.AriaAttributes;
type TooltipProps = {
  label: string;
  children: React.ReactElement<TooltipChildProps>;
  placement?: "top" | "bottom" | "left" | "right";
  delayMs?: number;
};

export function Tooltip({
  label,
  children,
  placement = "top",
  delayMs = 120,
}: Readonly<TooltipProps>) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const tRef = useRef<number | null>(null);
  const wrapRef = useRef<HTMLSpanElement | null>(null);

  useEffect(
    () => () => {
      if (tRef.current) clearTimeout(tRef.current);
    },
    [],
  );

  const show = () => {
    if (tRef.current) clearTimeout(tRef.current);
    tRef.current = window.setTimeout(() => setOpen(true), delayMs);
  };
  const hide = () => {
    if (tRef.current) clearTimeout(tRef.current);
    setOpen(false);
  };

  const offset = 10;
  let posClass = "";
  switch (placement) {
    case "top":
      posClass = `bottom-full left-1/2 -translate-x-1/2 mb-[${offset}px]`;
      break;
    case "bottom":
      posClass = `top-full left-1/2 -translate-x-1/2 mt-[${offset}px]`;
      break;
    case "left":
      posClass = `right-full top-1/2 -translate-y-1/2 mr-[${offset}px]`;
      break;
    default:
      posClass = `left-full top-1/2 -translate-y-1/2 ml-[${offset}px]`;
  }

  // Clone the child and attach ARIA + event handlers directly to it to avoid nested interactive content
  const child = cloneElement<TooltipChildProps>(children, {
    "aria-describedby": open ? id : undefined,
    onMouseEnter: (e) => {
      children.props?.onMouseEnter?.(e);
      show();
    },
    onMouseLeave: (e) => {
      children.props?.onMouseLeave?.(e);
      hide();
    },
    onFocus: (e) => {
      children.props?.onFocus?.(e);
      show();
    },
    onBlur: (e) => {
      children.props?.onBlur?.(e);
      hide();
    },
    onKeyDown: (e) => {
      children.props?.onKeyDown?.(e);
      if (e.key === "Escape") hide();
    },
  });
  return (
    <span ref={wrapRef} className="relative inline-flex">
      {child}
      <span
        id={id}
        role="tooltip"
        aria-hidden={open ? undefined : true}
        className={clsx(
          "pointer-events-none absolute z-overlay bg-white/10 backdrop-blur-md border border-white/20 rounded-md px-4 py-2 text-[11px] uc tracking-wide text-white whitespace-nowrap",
          "transition-[opacity,transform] duration-300 ease-[var(--ease-premium)]",
          open ? "opacity-100 scale-100" : "opacity-0 scale-95",
          posClass,
        )}
      >
        {label}
      </span>
    </span>
  );
}
