import StaggerReveal from '@/components/StaggerReveal';
import Link from 'next/link';
import type { CSSProperties } from 'react';
import ContainerWide from '@/components/layout/ContainerWide';
import ContainerRow from '@/components/layout/ContainerRow';
import SectionBand from '@/components/layout/SectionBand';
import { Grid12, Span } from '@/components/layout/Grid12';

export default function Page() {
  type CSSVars = CSSProperties & {
    ['--auto-grid-min']?: string;
    ['--auto-grid-gap']?: string;
    ['--auto-grid-gap-md']?: string;
    ['--auto-grid-gap-lg']?: string;
  };
  const gridStyle: CSSVars = {
    ['--auto-grid-min']: '16rem',
    ['--auto-grid-gap']: '1.5rem',
    ['--auto-grid-gap-md']: '2rem',
    ['--auto-grid-gap-lg']: '2.5rem',
  };
  return (
    <>
      {/* Hero section */}
      <SectionBand className="pt-28">
        <ContainerWide>
          <Grid12 data-reveal-blur-stagger>
            <Span cols={8}><h1 className="text-4xl md:text-5xl font-light">Products</h1></Span>
          </Grid12>
        </ContainerWide>
      </SectionBand>

      {/* Product cards */}
      <SectionBand>
        <StaggerReveal>
          <ContainerRow data-reveal-blur-stagger>
            <div className="auto-grid" style={gridStyle}>
              <Link className="group block border border-white/10 rounded-2xl p-7 hover:border-white/30 transition-colors link-underline arrow-shift" href="/products/aircraft/">
                <div className="text-xl">Aircraft</div><div className="mt-2 body text-white/60">Windows, windscreens, enclosures</div>
              </Link>
              <Link className="group block border border-white/10 rounded-2xl p-7 hover:border-white/30 transition-colors link-underline arrow-shift" href="/products/helicopters/">
                <div className="text-xl">Helicopters</div><div className="mt-2 body text-white/60">Cabin transparencies and doors</div>
              </Link>
              <Link className="group block border border-white/10 rounded-2xl p-7 hover:border-white/30 transition-colors link-underline arrow-shift" href="/products/motorsport/">
                <div className="text-xl">Motorsport</div><div className="mt-2 body text-white/60">Lightweight glazing & components</div>
              </Link>
            </div>
          </ContainerRow>
        </StaggerReveal>
      </SectionBand>
    </>
  );
}
