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
import SkipLink from '@/components/SkipLink';
import { getRequestNonce } from '@/lib/csp';

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
  const nonce = await getRequestNonce();
  return (
    <html lang="en" className={chronicleOn ? 'feature-chronicle-ui' : undefined}>
      <head>
        <link rel="preconnect" href="https://use.typekit.net" crossOrigin="" />
        <link rel="preconnect" href="https://p.typekit.net" crossOrigin="" />
        <link rel="stylesheet" href="https://use.typekit.net/szi2mge.css" />
  {/* Pre-hydration capture script with CSP nonce */}
  <script nonce={nonce}>{`(()=>{try{var reduce=(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches)===true;if(reduce)return;var isAuto=!!(navigator&&navigator.webdriver===true);function isInternal(a){if(!a)return false;var h=a.getAttribute?(a.getAttribute('href')||''):'';return h.indexOf('/')===0&&h.indexOf('/#')!==0}function clear(){document.body.classList.remove('cursor-hide-transition','pt-disable-scroll','pt-no-events');var ov=document.querySelector('svg.pt-blob-svg');if(ov)ov.setAttribute('data-active','0')}function markOverlayActive(){var ov=document.querySelector('svg.pt-blob-svg');if(ov){ov.setAttribute('data-active','1');ov.style.pointerEvents='none';return true}return false}if(isAuto){try{document.body.classList.add('cursor-hide-transition','pt-disable-scroll','pt-no-events')}catch(_){};if(!markOverlayActive()){var mo=new MutationObserver(function(){if(markOverlayActive()){try{mo.disconnect()}catch(_){}}});try{mo.observe(document.documentElement,{childList:true,subtree:true})}catch(_){}}setTimeout(clear,2200)}function onClick(e){var t=e.target;if(!t||!t.closest)return;var a=t.closest('a[href]');if(!isInternal(a))return;document.body.classList.add('cursor-hide-transition','pt-disable-scroll','pt-no-events');if(isAuto){setTimeout(clear,2200)}}document.addEventListener('click',onClick,true)}catch(_){}})();`}</script>
      </head>
  <body suppressHydrationWarning className="bg-black text-white antialiased min-h-dvh grid grid-rows-[auto_1fr_auto]">
  <SkipLink targetId={mainId} />
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
