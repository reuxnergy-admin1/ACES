"use client";
import { useEffect, useMemo, useState } from 'react';

export default function DebugRibbon() {
	const [show, setShow] = useState(false);
	const [mode, setMode] = useState<'user' | 'always'>('user');

	useEffect(() => {
		const read = () => {
			try {
				const v = (typeof localStorage !== 'undefined') ? localStorage.getItem('motionMode') : null;
				setMode(v === 'always' ? 'always' : 'user');
			} catch { /* noop */ }
		};
		read();
		const params = new URLSearchParams(window.location.search);
		const devParam = params.get('dev');
		setShow(process.env.NODE_ENV !== 'production' || devParam === '1');
		window.addEventListener('storage', read);
		window.addEventListener('motionmodechange', read as EventListener);
		return () => {
			window.removeEventListener('storage', read);
			window.removeEventListener('motionmodechange', read as EventListener);
		};
	}, []);

	const label = useMemo(() => mode === 'always' ? 'Animations: Off' : 'Animations: On', [mode]);

	const toggle = () => {
		const next = mode === 'always' ? 'user' : 'always';
		try {
			localStorage.setItem('motionMode', next);
			window.dispatchEvent(new Event('motionmodechange'));
			setMode(next);
		} catch { /* noop */ }
	};

	if (!show) return null;
	return (
		<div className="fixed bottom-3 right-3 z-overlay">
			<button type="button" className="surface surface-90 surface-strong radius-full px-3 py-2 text-xs border border-white/15 text-white/80 hover:text-white hover:border-white/40 transition-colors"
				onClick={toggle}
				aria-pressed={mode === 'always'}
				title="Toggle reduced motion">
				{label}
			</button>
		</div>
	);
}
