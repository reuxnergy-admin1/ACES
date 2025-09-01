"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

type Toast = Readonly<{
  id: number;
  message: string;
  variant?: 'success' | 'error' | 'info';
  duration?: number;
}>;

type ToastAPI = Readonly<{
  show: (message: string, opts?: { variant?: Toast['variant']; duration?: number }) => number;
  dismiss: (id: number) => void;
}>;

const ToastCtx = createContext<ToastAPI | null>(null);

export function useToast() {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error('useToast must be used within <ToastProvider>');
  return ctx;
}

export default function ToastProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const idRef = useRef(1);
  const timers = useRef<Map<number, number>>(new Map());

  const dismiss = useCallback((id: number) => {
    setToasts((ts) => ts.filter((t) => t.id !== id));
    const t = timers.current.get(id);
    if (t) {
      window.clearTimeout(t);
      timers.current.delete(id);
    }
  }, []);

  const show = useCallback<ToastAPI['show']>((message, opts) => {
    const id = idRef.current++;
    const toast: Toast = { id, message, variant: opts?.variant ?? 'info', duration: opts?.duration ?? 2800 };
    setToasts((ts) => [...ts, toast]);
    // Auto-dismiss
    const timer = window.setTimeout(() => dismiss(id), toast.duration);
    timers.current.set(id, timer);
    return id;
  }, [dismiss]);

  // Cleanup timers on unmount
  useEffect(() => () => { timers.current.forEach((t) => { window.clearTimeout(t); }); timers.current.clear(); }, []);

  const api = useMemo<ToastAPI>(() => ({ show, dismiss }), [show, dismiss]);

  return (
    <ToastCtx.Provider value={api}>
      {children}
      {/* Toast region */}
      <output
        className="toast-host fixed bottom-4 left-1/2 -translate-x-1/2 z-overlay"
        aria-live="polite"
        aria-atomic="false"
      >
        {toasts.map((t) => (
          <div key={t.id} className={"toast" + (t.variant ? ` toast--${t.variant}` : "")}>
            <div className="toast__body">{t.message}</div>
    <button type="button" className="toast__close" aria-label="Dismiss" onClick={() => dismiss(t.id)}>×</button>
          </div>
        ))}
  </output>
    </ToastCtx.Provider>
  );
}

