import './globals.css';
import type { ReactNode } from 'react';
import { useId } from 'react';
import { Nav } from '@/components/Nav';
import ResponsiveContours from '@/components/ResponsiveContours';
import { Footer } from '@/components/Footer';
import CursorOverlayGate from '@/components/CursorOverlayGate';
import ContoursSVG from '@/components/ContoursSVG';
import PageTransition from '@/components/PageTransition';

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

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  const mainId = useId();
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://use.typekit.net" crossOrigin="" />
        <link rel="preconnect" href="https://p.typekit.net" crossOrigin="" />
        <link rel="stylesheet" href="https://use.typekit.net/szi2mge.css" />
      </head>
  <body className="bg-black text-white antialiased min-h-dvh grid grid-rows-[auto_1fr_auto]" style={{ cursor: 'none' }}>
  <a href={`#${mainId}`} className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-overlay focus:bg-white focus:text-black focus:px-3 focus:py-2 focus:rounded">Skip to content</a>
        {/* Immediate paint: server SVG fallback, then ResponsiveContours upgrades lazily */}
        <div aria-hidden className="fixed inset-0 z-0 pointer-events-none">
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
        <div data-app-content className="relative z-content row-start-3 row-end-4">
          <Footer />
        </div>
  <CursorOverlayGate />
      </body>
    </html>
  );
}
