"use client";
import { useEffect, useRef } from "react";
import type { ReactNode } from "react";

type Props = Readonly<{
	children: ReactNode;
	className?: string;
}>;

// Inversion wipe card: no per-mousemove highlight; pure CSS-driven left-to-right wipe.
export default function SheenCard({ children, className = "" }: Props) {
	const ref = useRef<HTMLDivElement>(null);
	useEffect(() => {
		const el = ref.current;
		if (!el) return;
		const onPointerEnter = () => {
			// Standard LTR: start offscreen left then animate to rest
			el.style.setProperty('--wipe-x', '-101%');
			requestAnimationFrame(() => {
				el.style.setProperty('--wipe-x', '0%');
			});
		};
		const onPointerLeave = () => {
			// Exit to the right
			el.style.setProperty('--wipe-x', '101%');
		};
		const onFocusIn = () => { el.style.setProperty('--wipe-x', '0%'); };
		const onFocusOut = () => { el.style.setProperty('--wipe-x', '-101%'); };
		el.addEventListener('pointerenter', onPointerEnter, { passive: true } as AddEventListenerOptions);
		el.addEventListener('pointerleave', onPointerLeave, { passive: true } as AddEventListenerOptions);
		el.addEventListener('focusin', onFocusIn);
		el.addEventListener('focusout', onFocusOut);
		return () => {
			el.removeEventListener('pointerenter', onPointerEnter as EventListener);
			el.removeEventListener('pointerleave', onPointerLeave as EventListener);
			el.removeEventListener('focusin', onFocusIn as EventListener);
			el.removeEventListener('focusout', onFocusOut as EventListener);
		};
	}, []);
	return (
		<div ref={ref} className={`sheen-card ${className}`}>
			{children}
		</div>
	);
}
