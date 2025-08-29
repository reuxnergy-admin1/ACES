import type { ReactNode } from 'react';

type Props = Readonly<{ children: ReactNode; className?: string }>;

export default function ContainerFluid({ children, className = '' }: Props) {
  return <div className={`container-fluid ${className}`}>{children}</div>;
}
