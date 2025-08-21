'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import clsx from 'clsx';

const NavLink = ({ href, children }:{href:string; children:React.ReactNode}) => (
  <Link href={href} className="wipe-link px-3 py-2 text-sm md:text-base text-white/80 hover:text-white">
    {children}
  </Link>
);

export function Nav() {
  const [open, setOpen] = useState(false);
  return (
    <header className="fixed top-0 left-0 right-0 z-40 supports-[backdrop-filter]:backdrop-blur-sm bg-black/40">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/30 to-transparent" aria-hidden="true" />
      <div className="relative mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
        <Link href="/" aria-label="ACES home" className="flex items-center group/logo relative">
          <Image
            src="/aces-logo.svg"
            alt="ACES Aerodynamics"
            width={82}
            height={24}
            priority
          />
          <span aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-0 group-hover/logo:opacity-100 transition-opacity duration-300">
            <span className="absolute -inset-2 translate-x-[-120%] group-hover/logo:translate-x-[120%] transition-transform duration-700 ease-out"
                  style={{
                    background: 'linear-gradient(100deg, transparent 30%, rgba(255,255,255,0.35) 50%, transparent 70%)',
                    WebkitMaskImage: 'url(/aces-logo.svg)',
                    maskImage: 'url(/aces-logo.svg)',
                    WebkitMaskRepeat: 'no-repeat',
                    maskRepeat: 'no-repeat',
                    WebkitMaskSize: 'contain',
                    maskSize: 'contain',
                    WebkitMaskPosition: 'center',
                    maskPosition: 'center'
                  }} />
          </span>
        </Link>
  <button type="button" aria-label="Menu" className="md:hidden px-3 py-2" onClick={() => setOpen(!open)}>
          <span className="sr-only">Toggle menu</span>
          <div className="w-6 h-px bg-white mb-1"></div>
          <div className="w-6 h-px bg-white"></div>
        </button>
        <nav className="hidden md:flex items-center gap-2">
          <NavLink href="/about/history/">About</NavLink>
          <NavLink href="/products/">Products</NavLink>
          <NavLink href="/services/">Services</NavLink>
          <NavLink href="/blog/">Blog</NavLink>
          <NavLink href="/signin/">Sign In</NavLink>
          <NavLink href="/order/">Order</NavLink>
          <Link href="/contact/" className="button-primary ml-2">Request a Quote</Link>
          <Link href="/contact/?type=specialist" className="wipe-link ml-2">Speak to a Specialist</Link>
        </nav>
      </div>
      <div className={clsx('md:hidden bg-black/95 backdrop-blur border-t border-white/10', open ? 'block' : 'hidden')}>
        <div className="px-4 py-4 flex flex-col gap-2">
          <NavLink href="/about/history/">About</NavLink>
          <NavLink href="/products/">Products</NavLink>
          <NavLink href="/services/">Services</NavLink>
          <NavLink href="/blog/">Blog</NavLink>
          <NavLink href="/signin/">Sign In</NavLink>
          <NavLink href="/order/">Order</NavLink>
          <Link href="/contact/" className="button-primary mt-2">Request a Quote</Link>
          <Link href="/contact/?type=specialist" className="wipe-link">Speak to a Specialist</Link>
        </div>
      </div>
    </header>
  );
}
