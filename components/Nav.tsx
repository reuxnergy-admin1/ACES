'use client';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState, useId } from 'react';
import clsx from 'clsx';

type NavChild = { href: string; label: string };
type NavItem = { id: string; href: string; label: string; children?: NavChild[] };
type Inertable = HTMLElement & { inert?: boolean };

export function Nav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const menuId = useId();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);
  const ticking = useRef(false);
  const scrollYRef = useRef(0);
  const headerRef = useRef<HTMLElement | null>(null);
  const sheenRef = useRef<HTMLDivElement | null>(null);

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
          // Threshold to avoid jitter but remain responsive
          const threshold = 3;
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

  // Mobile menu: lock scroll & close on Escape; inert background; focus management; collapse accordions on close
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    if (open) {
      document.addEventListener('keydown', onKey);
      // Save position and lock scroll (iOS-safe)
      scrollYRef.current = window.scrollY;
      const html = document.documentElement;
      const body = document.body as HTMLBodyElement & { _prevOverflow?: string; _prevPos?: string; _prevTop?: string; _prevWidth?: string };
      body._prevOverflow = body.style.overflow;
      body._prevPos = body.style.position;
      body._prevTop = body.style.top;
      body._prevWidth = body.style.width;
      html.style.overflow = 'hidden';
      body.style.overflow = 'hidden';
      body.style.position = 'fixed';
      body.style.width = '100%';
      body.style.top = `-${scrollYRef.current}px`;
      // Inert non-menu app content and set aria-hidden
      document.querySelectorAll('[data-app-content]')
        .forEach((el) => {
          const he = el as Inertable;
          he.inert = true;
          he.setAttribute('aria-hidden', 'true');
        });
      // Focus the close button for accessibility
      requestAnimationFrame(() => closeBtnRef.current?.focus());
    } else {
      document.removeEventListener('keydown', onKey);
      // Restore scroll
      const html = document.documentElement;
      const body = document.body as HTMLBodyElement & { _prevOverflow?: string; _prevPos?: string; _prevTop?: string; _prevWidth?: string };
      html.style.overflow = '';
      if (body.style.position === 'fixed') {
        body.style.overflow = body._prevOverflow ?? '';
        body.style.position = body._prevPos ?? '';
        const top = body.style.top;
        body.style.top = body._prevTop ?? '';
        body.style.width = body._prevWidth ?? '';
        const offset = top ? parseInt(top.replace(/[^-\d]/g, ''), 10) : 0;
        window.scrollTo(0, -offset);
      }
      // Remove inert and aria-hidden; collapse mobile accordions
      document.querySelectorAll('[data-app-content]')
        .forEach((el) => {
          const he = el as Inertable;
          he.inert = false;
          he.removeAttribute('aria-hidden');
        });
  setMobileOpen({});
  // Return focus to the menu button after closing
  requestAnimationFrame(() => menuBtnRef.current?.focus());
    }
    return () => {
      document.removeEventListener('keydown', onKey);
      const html = document.documentElement;
      const body = document.body as HTMLBodyElement & { _prevOverflow?: string; _prevPos?: string; _prevTop?: string; _prevWidth?: string };
      html.style.overflow = '';
      body.style.overflow = body._prevOverflow ?? '';
      body.style.position = body._prevPos ?? '';
      body.style.top = body._prevTop ?? '';
      body.style.width = body._prevWidth ?? '';
      // Ensure inert is cleared if effect unmounts while menu open
      document.querySelectorAll('[data-app-content]')
        .forEach((el) => {
          const he = el as Inertable;
          he.inert = false;
          he.removeAttribute('aria-hidden');
        });
    };
  }, [open]);

  const items: NavItem[] = useMemo(() => ([
    {
      id: 'about',
      href: '/about/history/',
      label: 'ABOUT',
      children: [
        { href: '/about/history/', label: 'History' },
        { href: '/about/industries/', label: 'Industries' },
        { href: '/about/philosophy/', label: 'Philosophy' },
        { href: '/about/quality/', label: 'Quality' },
      ],
    },
    {
      id: 'products',
      href: '/products/',
      label: 'PRODUCTS',
      children: [
        { href: '/products/aircraft/', label: 'Aircraft Transparencies' },
        { href: '/products/helicopters/', label: 'Helicopter Transparencies' },
        { href: '/products/motorsport/', label: 'Motorsport Components' },
      ],
    },
    { id: 'services', href: '/services/', label: 'SERVICES' },
    { id: 'blog', href: '/blog/', label: 'BLOG' },
    { id: 'signin', href: '/signin/', label: 'SIGN IN' },
    { id: 'order', href: '/order/', label: 'ORDER' },
  ]), []);

  // Desktop dropdown open state
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [panelShow, setPanelShow] = useState(false);
  // Hover-intent: keep menu open while moving between trigger and panel
  const closeTimer = useRef<number | null>(null);
  const cancelClose = useCallback(() => {
    if (closeTimer.current) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }, []);
  const scheduleClose = useCallback(() => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setOpenMenu(null), 280);
  }, []);

  // Animate desktop panel on mount
  useEffect(() => {
    if (openMenu) {
      setPanelShow(false);
      const raf = requestAnimationFrame(() => setPanelShow(true));
      return () => cancelAnimationFrame(raf);
    } else {
      setPanelShow(false);
    }
  }, [openMenu]);
  // Mobile accordion state
  const [mobileOpen, setMobileOpen] = useState<Record<string, boolean>>({});
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const menuBtnRef = useRef<HTMLButtonElement | null>(null);
  const toggleMobile = useCallback((id: string) => {
    setMobileOpen(prev => ({ ...prev, [id]: !prev[id] }));
  }, []);

  // Desktop menubar refs/state
  const containerRef = useRef<HTMLDivElement | null>(null);
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const activeParent = useMemo(() => {
    const found = items.find((i) => i.id === openMenu && Array.isArray(i.children) && i.children.length > 0);
    return found ?? null;
  }, [items, openMenu]);


  // Keyboard navigation inside submenu panel
  const onSubmenuKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    const keys = ['ArrowDown', 'ArrowUp', 'Home', 'End'];
    if (!keys.includes(e.key)) return;
    e.preventDefault();
    const container = e.currentTarget;
    const links = Array.from(container.querySelectorAll<HTMLAnchorElement>('a[href]'));
    if (links.length === 0) return;
    const idx = links.findIndex((a) => a === document.activeElement);
    let next = idx;
    if (e.key === 'ArrowDown') next = (idx + 1 + links.length) % links.length;
    if (e.key === 'ArrowUp') next = (idx - 1 + links.length) % links.length;
    if (e.key === 'Home') next = 0;
    if (e.key === 'End') next = links.length - 1;
    links[next]?.focus();
  }, []);

  // Roving focus across top-level menu items on desktop (ArrowLeft/Right, Home/End)
  const onMenubarKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    const keys = ['ArrowLeft', 'ArrowRight', 'Home', 'End'];
    if (!keys.includes(e.key)) return;
    e.preventDefault();
    const order = items.map(i => i.href);
    const anchors = order.map(h => linkRefs.current[h]).filter(Boolean) as HTMLAnchorElement[];
    const active = document.activeElement as HTMLElement | null;
    const idx = active ? anchors.findIndex(a => a === active) : -1;
    let nextIdx = idx;
    if (e.key === 'ArrowRight') nextIdx = (idx + 1 + anchors.length) % anchors.length;
    if (e.key === 'ArrowLeft') nextIdx = (idx - 1 + anchors.length) % anchors.length;
    if (e.key === 'Home') nextIdx = 0;
    if (e.key === 'End') nextIdx = anchors.length - 1;
    anchors[nextIdx]?.focus();
  }, [items]);
  // Premium header sheen: subtle radial highlight that follows the cursor across the page
  useEffect(() => {
    const header = headerRef.current;
    const sheen = sheenRef.current;
    if (!header || !sheen) return;

    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const pointerFine = window.matchMedia('(pointer: fine)');
    if (media.matches || !pointerFine.matches) {
      sheen.style.opacity = '0';
      return;
    }

    let raf = 0;
    let latestX = 0, latestY = 0;
    let inside = false;

    const update = () => {
      const rect = header.getBoundingClientRect();
      const x = Math.max(0, Math.min(latestX - rect.left, rect.width));
      const y = Math.max(0, Math.min(latestY - rect.top, rect.height));
      // Update root so other sections (e.g., footer) can reference the same pointer vars
      document.documentElement.style.setProperty('--nav-x', `${x}px`);
      document.documentElement.style.setProperty('--nav-y', `${y}px`);
      sheen.style.opacity = inside ? '1' : '0';
      raf = 0;
    };

    const onMove = (e: PointerEvent | MouseEvent) => {
      latestX = (e as PointerEvent).clientX ?? (e as MouseEvent).clientX;
      latestY = (e as PointerEvent).clientY ?? (e as MouseEvent).clientY;
      const rect = header.getBoundingClientRect();
      inside = latestX >= rect.left && latestX <= rect.right && latestY >= rect.top && latestY <= rect.bottom;
      if (!raf) raf = requestAnimationFrame(update);
    };
    const onScrollOrResize = () => { if (!raf) raf = requestAnimationFrame(update); };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize);

    // Initial compute
    const rect = header.getBoundingClientRect();
    document.documentElement.style.setProperty('--nav-x', `${rect.width / 2}px`);
    document.documentElement.style.setProperty('--nav-y', `${rect.height + 40}px`);
    sheen.style.opacity = '0';

    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('scroll', onScrollOrResize);
      window.removeEventListener('resize', onScrollOrResize);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
  <header
      ref={headerRef}
      className={clsx(
  'fixed top-0 left-0 right-0 z-header transition-transform duration-700 will-change-transform motion-reduce:transition-none motion-reduce:transform-none supports-[backdrop-filter]:backdrop-blur-sm header-interactive',
        scrolled ? 'bg-black/60' : 'bg-transparent',
        hidden ? '-translate-y-full' : 'translate-y-0'
      )}
    >
  {/* Subtle gradient wash + interactive sheen */}
  <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/40 to-transparent" aria-hidden="true" />
  <div ref={sheenRef} className="nav-sheen" aria-hidden="true" />
  <div className={clsx('relative grid-shell py-3', scrolled ? 'border-b border-white/10' : 'border-b border-transparent')}>
        <div className="container-wide">
          {/* Desktop layout: wrapper hidden on mobile; inner uses our 12-col grid. Avoid conflict between hidden and grid-12. */}
          <div className="hidden md:block">
            <div className="grid-12 gutter items-center">
            <div className="md:col-span-2 flex items-center">
              <Link href="/" aria-label="ACES home" className="flex items-center">
              <Image src="/aces-logo.svg" alt="ACES Aerodynamics" width={88} height={26} priority />
              </Link>
            </div>
            <nav className="hidden md:flex items-center gap-4 md:col-span-8 justify-self-start" aria-label="Primary"
        onMouseEnter={cancelClose}
        onMouseLeave={scheduleClose}>
      <div
                ref={containerRef}
    className="relative flex items-center gap-2 py-1 overflow-hidden"
        role="menubar"
        aria-label="Main menu"
                aria-orientation="horizontal"
                tabIndex={0}
        onKeyDown={onMenubarKeyDown}
              >
              {items.map((item) => {
              const active = pathname?.startsWith(item.href);
              return (
                  <div key={item.id} className="relative">
                    <Link
                      href={item.href}
                      ref={(el) => { linkRefs.current[item.href] = el; }}
                      onMouseEnter={() => { cancelClose(); if (item.children) setOpenMenu(item.id); }}
                      onFocus={() => { cancelClose(); if (item.children) setOpenMenu(item.id); }}
                      className={clsx('group relative z-10 px-3 py-2 text-sm md:text-[0.95rem] tracking-[0.08em] uc transition-colors link-underline',
                        active ? 'text-white' : 'text-white/80 hover:text-white')}
                      aria-current={active ? 'page' : undefined}
                      aria-haspopup={item.children ? 'menu' : undefined}
                      aria-expanded={item.children ? (openMenu === item.id) : undefined}
                      role="menuitem"
                      id={`menuitem-${item.id}`}
                    >
                      {item.label}
                      {item.children ? <span className="hidden ml-1 pointer-events-none show-on-pointer-fine">+</span> : null}
                    </Link>
                  </div>
              );
            })}
              </div>
            </nav>
              <div className="hidden md:flex md:col-span-2 justify-self-end items-center gap-3 overflow-visible">
                <a
                  href="https://wa.me/27600000000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="button-wa shrink-0"
                  aria-label="Talk on WhatsApp"
                >
                  {/* WhatsApp icon */}
                  <svg aria-hidden xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.62-6.003C.122 5.281 5.403 0 12.057 0c3.181 0 6.167 1.24 8.413 3.488a11.79 11.79 0 013.49 8.414c-.002 6.653-5.283 11.934-11.938 11.934a11.95 11.95 0 01-6.002-1.619L.057 24zm6.597-3.807c1.741 1.035 3.276 1.666 5.392 1.666 5.448 0 9.886-4.434 9.889-9.877.003-5.462-4.415-9.89-9.881-9.894-5.452 0-9.89 4.434-9.894 9.888 0 2.225.651 3.891 1.746 5.634l-.999 3.648 3.747-.965zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.03-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.173.198-.297.297-.495.099-.198.05-.372-.025-.521-.075-.149-.669-1.611-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.71.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.29.173-1.413z"/>
                  </svg>
                  <span className="wa-label">TALK ON WHATSAPP</span>
                </a>
                <Link href="/contact/" className="button-solid arrow-shift shrink-0 no-wrap">REQUEST A <span className="btn-tail"><span>QUOTE</span> <span className="arrow" aria-hidden>→</span></span></Link>
              </div>
            </div>
          </div>

          {/* Mobile layout: grid for logo and menu button */}
          <div className="grid grid-cols-12 items-center md:hidden">
            <Link href="/" aria-label="ACES home" className="flex items-center col-span-8">
              <Image src="/aces-logo.svg" alt="ACES Aerodynamics" width={88} height={26} priority />
            </Link>
            <div className="col-span-4 justify-self-end">
              <button ref={menuBtnRef} type="button" aria-label="Menu" aria-controls={menuId} aria-expanded={open} className="px-3 h-11" onClick={() => setOpen(!open)}>
                <span className="sr-only">Toggle menu</span>
                <div className={clsx('w-6 h-px bg-white transition-transform duration-700', open ? 'translate-y-[3px] rotate-45' : 'rotate-0 mb-1')}></div>
                <div className={clsx('w-6 h-px bg-white transition-transform duration-700', open ? '-translate-y-[3px] -rotate-45' : 'rotate-0')}></div>
              </button>
            </div>
          </div>
        </div>
  </div>
  <dialog
        id={menuId}
        open={open}
  aria-modal="true"
        aria-labelledby={`${menuId}-title`}
        className={clsx(
            'md:hidden fixed inset-0 z-overlay m-0 p-0 surface surface-opaque surface--sm surface-strong elevate border-t border-white/12',
          'transition-opacity duration-500 ease-[var(--ease-premium)]',
          open ? 'opacity-100' : 'opacity-0'
        )}
      >
        {/* Close button (top-right) */}
        <button
          type="button"
          aria-label="Close menu"
          className="fixed top-4 right-3 w-11 h-11 inline-flex items-center justify-center rounded-full border border-white/20 text-white/90 hover:text-black hover:bg-white/90 transition-colors"
          onClick={() => setOpen(false)}
          ref={closeBtnRef}
        >
          <span className="sr-only">Close</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
        <div className="grid-shell pt-24 pb-12" style={{ overscrollBehavior: 'contain' }}>
          <div className="container-row space-y-3">
            <h2 id={`${menuId}-title`} className="sr-only">Menu</h2>
            {items.map((item) => {
              const active = pathname?.startsWith(item.href);
              const panelId = `${menuId}-${item.id}`;
              if (item.children && item.children.length > 0) {
                const expanded = !!mobileOpen[item.id];
                return (
                  <div key={item.id} className="border-b border-white/10 pb-2">
                    <button
                      type="button"
                      className={clsx('w-full flex items-center justify-between px-3 py-2 text-lg tracking-[0.08em] uc transition-colors', active ? 'text-white' : 'text-white/80 hover:text-white')}
                      aria-controls={panelId}
                      aria-expanded={expanded}
                      onClick={() => toggleMobile(item.id)}
                    >
                      <span>{item.label}</span>
                      <span aria-hidden="true" className="ml-2">{expanded ? '−' : '+'}</span>
                    </button>
                    <section
                      id={panelId}
                      aria-label={`${item.label} submenu`}
                      className={clsx(
                        'grid grid-cols-1 gap-1 pl-3 pr-3 overflow-hidden transition-[max-height,opacity] duration-700 ease-[var(--ease-premium)] motion-reduce:transition-none',
                        expanded ? 'mt-1 max-h-96 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
                      )}
                    >
                      {(item.children ?? []).map((c) => (
                        <Link key={c.href} href={c.href} tabIndex={expanded ? 0 : -1} className="link-underline py-1 text-white/80 hover:text-white">
                          {c.label}
                        </Link>
                      ))}
                    </section>
                  </div>
                );
              }
              return (
                <Link key={item.id} href={item.href} className={clsx('link-underline block px-3 py-2 text-lg tracking-[0.08em] text-white/80 hover:text-white uc', active && 'is-active text-white')}>
                  {item.label}
                </Link>
              );
            })}
            <Link href="/contact/" className="inline-flex items-center rounded-full border border-white/30 text-white/90 hover:text-black hover:bg-white/90 transition-colors duration-700 px-4 py-2 uc tracking-[0.08em]">REQUEST A QUOTE</Link>
          </div>
        </div>
      </dialog>
      {/* Dropdown panel (desktop) */}
    {openMenu && (
        <div
          role="menu"
          tabIndex={0}
      aria-label="Submenu"
      aria-labelledby={`menuitem-${openMenu}`}
          className={clsx(
            'hidden md:block absolute left-0 right-0 top-full z-header surface surface-90 surface--md surface-strong elevate radius-lg border-t border-white/12',
            'transition-[opacity,transform] duration-700 ease-[var(--ease-premium)] motion-reduce:transition-none',
            panelShow ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'
          )}
          onMouseEnter={cancelClose}
          onMouseLeave={scheduleClose}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              setOpenMenu(null);
              return;
            }
            onSubmenuKeyDown(e);
          }}
        >
          <div className="grid-shell">
            <div className="container-wide grid-12 gutter py-6">
              {activeParent && (
                <div key={activeParent.id} className="md:col-span-8">
                  <div className="text-white/60 uc tracking-[0.08em] text-xs">{activeParent.label}</div>
                  <ul className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {(activeParent.children ?? []).map((c) => (
                      <li key={c.href}>
                        <Link href={c.href} className="link-underline text-white/90 hover:text-white">
                          {c.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
