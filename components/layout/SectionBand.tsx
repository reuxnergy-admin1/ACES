import type { ReactNode } from 'react';

type Props = Readonly<{ children: ReactNode; className?: string }>;

export default function SectionBand({ children, className = '' }: Props) {
  return <section className={`section-band ${className}`}>{children}</section>;
}
