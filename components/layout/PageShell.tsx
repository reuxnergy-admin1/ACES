import type { ReactNode } from 'react';

type Props = Readonly<{ children: ReactNode; className?: string }>;

export default function PageShell({ children, className = '' }: Props) {
  return <div className={`grid-shell z-content ${className}`}>{children}</div>;
}
