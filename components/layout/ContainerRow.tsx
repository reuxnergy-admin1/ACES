import type { ReactNode } from 'react';

type Props = Readonly<{ children: ReactNode; className?: string }>;

export default function ContainerRow({ children, className = '' }: Props) {
  return <div className={`container-row ${className}`}>{children}</div>;
}
