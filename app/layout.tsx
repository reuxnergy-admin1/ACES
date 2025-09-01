import './globals.css';
import { cookies } from 'next/headers';
import type { ReactNode } from 'react';
import ContoursSVG from '@/components/ContoursSVG';
import CursorTrailGate from '@/components/CursorTrailGate';
import InViewReveals from '@/components/InViewReveals';
import { Footer } from '@/components/Footer';
import { Nav } from '@/components/Nav';
import PageTransition from '@/components/PageTransition';
import ResponsiveContours from '@/components/ResponsiveContours';
import ToastProvider from '@/components/ui/ToastProvider';

export const metadata = {
  metadataBase: new URL('https://www.acesaerodynamics.com'),
  title: 'ACES Aerodynamics — Precision Transparencies & Composites',
  description: 'SACAA-approved fabrication of cast acrylic transparencies and high-performance composites for aerospace and motorsport.',
  openGraph: {
    title: 'ACES Aerodynamics',
    description: 'Precision Transparencies & Composites',
    url: 'https://www.acesaerodynamics.com',
    locale: 'en_ZA',
    type: 'website',
  },
  icons: { icon: '/favicon.ico' }
};

export default async function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  const mainId = 'main-content';
  const cookieStore = await cookies();
  const chronicleOn = cookieStore.get('feature-chronicle-ui')?.value === '1';
  return (
    <html lang="en" className={chronicleOn ? 'feature-chronicle-ui' : undefined}>
      <head>
        <link rel="preconnect" href="https://use.typekit.net" crossOrigin="" />
        <link rel="preconnect" href="https://p.typekit.net" crossOrigin="" />
        <link rel="stylesheet" href="https://use.typekit.net/szi2mge.css" />
      </head>
  <body suppressHydrationWarning className="bg-black text-white antialiased min-h-dvh grid grid-rows-[auto_1fr_auto]">
  <a href={`#${mainId}`} className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-overlay focus:bg-white focus:text-black focus:px-3 focus:py-2 focus:rounded">Skip to content</a>
  <ToastProvider>
    {/* Immediate paint: server SVG fallback, hidden when GL is ready (body.bg-gl-ready) */}
    <div data-bg-fallback aria-hidden data-vrt-mask className="fixed inset-0 z-bg pointer-events-none">
      <ContoursSVG />
    </div>
    <ResponsiveContours />
    <div className="relative z-header row-start-1 row-end-2">
      <Nav />
    </div>
    <PageTransition>
      <main id={mainId} data-app-content className="relative z-content fade-stagger row-start-2 row-end-3">
        {children}
      </main>
    </PageTransition>
    <InViewReveals />
    <div data-app-content className="relative z-content row-start-3 row-end-4">
      <Footer />
    </div>
    {/* Crisp cursor with very short trail for fine pointers */}
    <CursorTrailGate />
  </ToastProvider>
      </body>
    </html>
  );
}
