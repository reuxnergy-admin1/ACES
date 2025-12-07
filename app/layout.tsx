import './globals.css';
import { cookies } from 'next/headers';
import type { ReactNode } from 'react';
import { Open_Sans } from 'next/font/google';
import ContoursSVG from '@/components/ContoursSVG';
import CursorTrailGate from '@/components/CursorTrailGate';
import InViewReveals from '@/components/InViewReveals';
import { Footer } from '@/components/Footer';
import { Nav } from '@/components/Nav';
import PageTransition from '@/components/PageTransition';
import ResponsiveContours from '@/components/ResponsiveContours';
import ToastProvider from '@/components/ui/ToastProvider';
import SkipLink from '@/components/SkipLink';
import { getRequestNonce } from '@/lib/csp';

const openSans = Open_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-open-sans',
});

export const viewport = {
  themeColor: '#000000',
};

export const metadata = {
  metadataBase: new URL('https://www.acesaerodynamics.com'),
  title: {
    default: 'ACES Aerodynamics — Precision Transparencies & Composites',
    template: '%s | ACES Aerodynamics',
  },
  description: 'SACAA-approved fabrication of cast acrylic transparencies and high-performance composites for aerospace and motorsport. Based in South Africa, serving global aviation and racing industries.',
  keywords: ['aerospace transparencies', 'aircraft canopies', 'helicopter windscreens', 'motorsport composites', 'cast acrylic', 'SACAA approved', 'aviation manufacturing', 'South Africa aerospace'],
  authors: [{ name: 'ACES Aerodynamics' }],
  creator: 'ACES Aerodynamics',
  publisher: 'ACES Aerodynamics',
  openGraph: {
    title: 'ACES Aerodynamics — Precision Transparencies & Composites',
    description: 'SACAA-approved fabrication of cast acrylic transparencies and high-performance composites for aerospace and motorsport.',
    url: 'https://www.acesaerodynamics.com',
    siteName: 'ACES Aerodynamics',
    locale: 'en_ZA',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ACES Aerodynamics - Precision Engineering',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ACES Aerodynamics — Precision Transparencies & Composites',
    description: 'SACAA-approved fabrication of cast acrylic transparencies and high-performance composites for aerospace and motorsport.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32', type: 'image/x-icon' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  verification: {
    // Add verification codes when available
    // google: 'your-google-verification-code',
    // bing: 'your-bing-verification-code',
  },
};

export default async function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  const mainId = 'main-content';
  const cookieStore = await cookies();
  const chronicleOn = cookieStore.get('feature-chronicle-ui')?.value === '1';
  const nonce = await getRequestNonce();
  return (
    <html lang="en" className={`${openSans.variable} ${chronicleOn ? 'feature-chronicle-ui' : ''}`}>
      <head>
        <link rel="preconnect" href="https://use.typekit.net" crossOrigin="" />
        <link rel="preconnect" href="https://p.typekit.net" crossOrigin="" />
        <link rel="preload" href="https://use.typekit.net/szi2mge.css?display=swap" as="style" />
        <link rel="stylesheet" href="https://use.typekit.net/szi2mge.css?display=swap" />
  {/* Pre-hydration capture script with CSP nonce - only modifies body classes to avoid SVG hydration mismatch */}
  <script nonce={nonce}>{`(()=>{try{var reduce=(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches)===true;if(reduce)return;function isInternal(a){if(!a)return false;var h=a.getAttribute?(a.getAttribute('href')||''):'';return h.indexOf('/')===0&&h.indexOf('/#')!==0}function clear(){document.body.classList.remove('cursor-hide-transition','pt-disable-scroll','pt-no-events')}function onClick(e){var t=e.target;if(!t||!t.closest)return;var a=t.closest('a[href]');if(!isInternal(a))return;document.body.classList.add('cursor-hide-transition','pt-disable-scroll','pt-no-events')}document.addEventListener('click',onClick,true)}catch(_){}})();`}</script>
      </head>
  <body suppressHydrationWarning className="bg-black text-white antialiased min-h-dvh grid grid-rows-[auto_1fr_auto]">
  <SkipLink targetId={mainId} />
  <ToastProvider>
    {/* Immediate paint: server SVG fallback, hidden when GL is ready (body.bg-gl-ready) */}
    <div data-bg-fallback aria-hidden="true" data-vrt-mask className="fixed inset-0 z-bg pointer-events-none">
      <ContoursSVG />
    </div>
    <ResponsiveContours />
    <div className="relative z-header row-start-1 row-end-2">
      <Nav />
    </div>
    <PageTransition>
  <main id={mainId} data-app-content className="relative z-content fade-stagger row-start-2 row-end-3" tabIndex={-1}>
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
