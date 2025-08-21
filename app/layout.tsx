import './globals.css';
import type { ReactNode } from 'react';
import { Nav } from '@/components/Nav';
import ResponsiveContours from '@/components/ResponsiveContours';
import { Footer } from '@/components/Footer';

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
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://use.typekit.net/szi2mge.css" />
      </head>
  <body className="bg-black text-white antialiased" style={{ cursor: 'none' }}>
        <ResponsiveContours />
        <div className="relative z-10">
          <Nav />
          <div className="relative z-10">
            {children}
          </div>
          <Footer />
        </div>
      </body>
    </html>
  );
}
