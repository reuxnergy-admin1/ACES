'use client';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState, useId } from 'react';
import clsx from 'clsx';

type NavItem = { href: string; label: string };

export function Nav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const menuId = useId();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);
  const ticking = useRef(false);

  // Auto-close mobile menu on route change
  useEffect(() => {
    // Close the mobile menu whenever the route changes
    if (pathname !== undefined) setOpen(false);
  }, [pathname]);

  // Header hide/unhide on scroll (hide on scroll down, show on scroll up), and toggle background when scrolled
  useEffect(() => {
    const onScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          const y = window.scrollY || 0;
          setScrolled(y > 8);
          const delta = y - lastY.current;
          // Threshold to avoid jitter
          const threshold = 6;
          if (y > 80 && delta > threshold) setHidden(true);
          else if (delta < -threshold || y < 10) setHidden(false);
          lastY.current = y;
          ticking.current = false;
        });
        ticking.current = true;
      }
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const items: NavItem[] = useMemo(() => ([
    { href: '/about/history/', label: 'ABOUT' },
    { href: '/products/', label: 'PRODUCTS' },
    { href: '/services/', label: 'SERVICES' },
    { href: '/blog/', label: 'BLOG' },
    { href: '/signin/', label: 'SIGN IN' },
    { href: '/order/', label: 'ORDER' },
  ]), []);

  // Desktop hover background pill refs/state
  const hoverRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});

  const moveHover = useCallback((href: string | null) => {
    const pill = hoverRef.current;
    const container = containerRef.current;
    if (!pill || !container) return;
    const targetHref = href ?? items.find(i => pathname?.startsWith(i.href))?.href ?? null;
    const targetEl = targetHref ? linkRefs.current[targetHref] : null;
    const contRect = container.getBoundingClientRect();
    if (targetEl) {
      const r = targetEl.getBoundingClientRect();
      const pad = 8; // little horizontal breathing room
      const x = r.left - contRect.left - pad / 2;
      const w = r.width + pad;
      pill.style.opacity = '1';
      pill.style.transform = `translate(${x}px, -50%)`;
      pill.style.width = `${w}px`;
    } else {
      // Hide when no active target
      pill.style.opacity = '0';
      pill.style.width = '0px';
    }
  }, [items, pathname]);

  useEffect(() => {
    moveHover(null);
    const onResize = () => moveHover(null);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [moveHover]);

  // Hide/revert indicator to active item when pointer leaves the group (attached via DOM to avoid a11y lint on JSX)
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const handler = () => moveHover(null);
    el.addEventListener('mouseleave', handler);
    return () => el.removeEventListener('mouseleave', handler);
  }, [moveHover]);
  return (
    <header
      className={clsx(
        'fixed top-0 left-0 right-0 z-header transition-transform duration-300 motion-reduce:transition-none motion-reduce:transform-none supports-[backdrop-filter]:backdrop-blur-sm',
        scrolled ? 'bg-black/60' : 'bg-transparent',
        hidden ? '-translate-y-full' : 'translate-y-0'
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/40 to-transparent" aria-hidden="true" />
      <div className={clsx('relative grid-shell py-3', scrolled ? 'border-b border-white/10' : 'border-b border-transparent')}>
        <div className="container-row">
          {/* Desktop layout: 3-column grid [logo][flex gap][cta], nav centered within the middle column */}
          <div className="hidden md:grid md:grid-cols-[auto_1fr_auto] md:items-center">
            <Link href="/" aria-label="ACES home" className="flex items-center">
              <Image src="/aces-logo.svg" alt="ACES Aerodynamics" width={88} height={26} priority />
            </Link>
            <nav className="hidden md:flex items-center gap-4 justify-self-center" aria-label="Primary">
              <div
                ref={containerRef}
                className="relative flex items-center gap-2 py-1"
              >
            {/* Sliding hover background pill */}
            <div
              ref={hoverRef}
              aria-hidden
              className="absolute top-1/2 left-0 -translate-y-1/2 h-[34px] rounded-full bg-white/10 supports-[backdrop-filter]:backdrop-blur-sm"
              style={{ width: 0, transform: 'translate(0px, -50%)', transition: 'transform 320ms var(--ease-premium), width 320ms var(--ease-premium), opacity 220ms var(--ease-premium)', opacity: 0 }}
            />
            {items.map((item) => {
              const active = pathname?.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  ref={(el) => { linkRefs.current[item.href] = el; }}
                  onMouseEnter={() => moveHover(item.href)}
                  onFocus={() => moveHover(item.href)}
                  className={clsx('relative z-10 px-3 py-2 text-sm md:text-[0.95rem] tracking-[0.08em] uc transition-colors',
                    active ? 'text-white' : 'text-white/80 hover:text-white')}
                  aria-current={active ? 'page' : undefined}
                >
                  {item.label}
                </Link>
              );
            })}
              </div>
            </nav>
            <div className="hidden md:flex justify-self-end">
              <Link href="/contact/" className="inline-flex items-center rounded-full border border-white/30 text-white/90 hover:text-black hover:bg-white/90 transition-all duration-300 px-4 py-2 uc tracking-[0.08em] hover:rounded-xl">REQUEST A QUOTE</Link>
            </div>
          </div>

          {/* Mobile layout: grid for logo and menu button */}
          <div className="grid grid-cols-12 items-center md:hidden">
            <Link href="/" aria-label="ACES home" className="flex items-center col-span-8">
              <Image src="/aces-logo.svg" alt="ACES Aerodynamics" width={88} height={26} priority />
            </Link>
            <div className="col-span-4 justify-self-end">
              <button type="button" aria-label="Menu" aria-controls={menuId} aria-expanded={open} className="px-3 h-11" onClick={() => setOpen(!open)}>
                <span className="sr-only">Toggle menu</span>
                <div className={clsx('w-6 h-px bg-white transition-transform duration-500', open ? 'translate-y-[3px] rotate-45' : 'rotate-0 mb-1')}></div>
                <div className={clsx('w-6 h-px bg-white transition-transform duration-500', open ? '-translate-y-[3px] -rotate-45' : 'rotate-0')}></div>
              </button>
            </div>
          </div>
        </div>
  </div>
  <div id={menuId} className={clsx('md:hidden fixed inset-0 z-30 bg-black/95 backdrop-blur', open ? 'block' : 'hidden')}>
        <div className="grid-shell pt-24 pb-12 space-y-4">
          {items.map((item) => {
            const active = pathname?.startsWith(item.href);
            return (
              <Link key={item.href} href={item.href} className={clsx('link-underline px-3 py-2 text-lg tracking-[0.08em] text-white/80 hover:text-white uc', active && 'is-active text-white')}>
                {item.label}
              </Link>
            );
          })}
          <Link href="/contact/" className="inline-flex items-center rounded-full border border-white/30 text-white/90 hover:text-black hover:bg-white/90 transition-colors px-4 py-2 uc tracking-[0.08em]">REQUEST A QUOTE</Link>
        </div>
      </div>
    </header>
  );
}
