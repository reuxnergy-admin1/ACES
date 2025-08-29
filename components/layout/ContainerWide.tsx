import type { ReactNode } from 'react';

type Props = Readonly<{ children: ReactNode; className?: string }>;

export default function ContainerWide({ children, className = '' }: Props) {
  return <div className={`container-wide ${className}`}>{children}</div>;
}
