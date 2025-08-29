"use client";
import { useEffect, useId, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';

export type LBOption = Readonly<{ value: string; label: string; disabled?: boolean }>;

type Props = Readonly<{
  name?: string;
  options: LBOption[];
  value: string;
  onChange: (v: string) => void;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
  maxHeight?: number;
}>;

export default function Listbox({ name, options, value, onChange, className = '', placeholder = 'Select…', disabled = false, maxHeight = 320 }: Props) {
  const uid = useId();
  const listboxId = `${uid}-listbox`;
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(false);
  const [placeAbove, setPlaceAbove] = useState(false);
  const activeIndex = Math.max(0, options.findIndex(o => o.value === value));
  const [highlight, setHighlight] = useState<number>(activeIndex);

  const label = useMemo(() => options.find(o => o.value === value)?.label ?? placeholder, [options, value, placeholder]);

  useEffect(() => { if (!open) setHighlight(Math.max(0, options.findIndex(o => o.value === value))); }, [open, options, value]);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!open) return;
      const t = e.target as Node | null;
      if (buttonRef.current?.contains(t) || panelRef.current?.contains(t)) return;
      setOpen(false);
    }
    const opts: AddEventListenerOptions = { capture: true };
    document.addEventListener('mousedown', onDoc, opts);
    return () => document.removeEventListener('mousedown', onDoc, opts);
  }, [open]);

  // Decide placement when opening
  useEffect(() => {
    if (!open) return;
    const btn = buttonRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    setPlaceAbove(spaceBelow < Math.min(maxHeight, 320) && spaceAbove > spaceBelow);
  }, [open, maxHeight]);

  function onKeyDown(e: React.KeyboardEvent<HTMLButtonElement | HTMLDivElement>) {
    if (!open) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setOpen(true);
      }
      return;
    }
    if (e.key === 'Escape') { e.preventDefault(); setOpen(false); buttonRef.current?.focus(); return; }
    if (e.key === 'ArrowDown') { e.preventDefault(); setHighlight(h => Math.min(options.length - 1, h + 1)); return; }
    if (e.key === 'ArrowUp') { e.preventDefault(); setHighlight(h => Math.max(0, h - 1)); return; }
    if (e.key === 'Home') { e.preventDefault(); setHighlight(0); return; }
    if (e.key === 'End') { e.preventDefault(); setHighlight(options.length - 1); return; }
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const opt = options[highlight];
      if (opt) { onChange(opt.value); setOpen(false); buttonRef.current?.focus(); }
      return;
    }
  }

  return (
    <div className={clsx('ui-lb relative inline-block w-full', className)}>
      {name ? <input type="hidden" name={name} value={value} /> : null}
      <button
        ref={buttonRef}
        type="button"
        className={clsx(
          'ui-lb__button w-full bg-black text-white/90 text-left',
          'border border-white/20 radius-md px-4 py-3 pr-9',
          'transition-colors duration-300 ease-[var(--easing-ui)]',
          open ? 'border-white/35' : '',
          disabled && 'opacity-60 cursor-not-allowed'
        )}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        onClick={() => !disabled && setOpen(o => !o)}
        onKeyDown={onKeyDown}
        disabled={disabled}
      >
        <span className="truncate inline-block align-middle">{label}</span>
        <span aria-hidden className="ui-lb__icon absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-white/70">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </span>
      </button>
      {open && (
        <div
          ref={panelRef}
          className={clsx(
            'ui-lb__panel absolute left-0 right-0 z-overlay surface surface-90 surface-strong radius-md elevate overflow-auto',
            placeAbove ? 'bottom-full mb-2 origin-bottom' : 'top-full mt-2 origin-top'
          )}
          style={{ maxHeight }}
          role="listbox"
          id={listboxId}
          tabIndex={-1}
          onKeyDown={onKeyDown}
          aria-activedescendant={`${listboxId}-opt-${highlight}`}
          data-open={open ? '1' : '0'}
        >
          {options.map((opt, i) => {
            const selected = opt.value === value;
            const active = i === highlight;
            return (
              <div
                key={opt.value}
                role="option"
                aria-selected={selected}
                id={`${listboxId}-opt-${i}`}
                className={clsx(
                  'ui-lb__option flex items-center gap-2 px-3 py-2 cursor-pointer select-none transition-colors',
                  selected ? 'bg-white/10 text-white' : 'text-white/90',
                  active && 'bg-white/15'
                )}
                onMouseEnter={() => setHighlight(i)}
                onClick={() => { if (!opt.disabled) { onChange(opt.value); setOpen(false); buttonRef.current?.focus(); } }}
              >
                <span aria-hidden className={clsx('inline-flex w-4 h-4 items-center justify-center rounded-full border', selected ? 'border-white/80 text-white' : 'border-white/30 text-transparent') }>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M20 6L9 17l-5-5"/></svg>
                </span>
                <span className="truncate">{opt.label}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
