import type { ReactNode, ElementType } from 'react';

type Props = Readonly<{ children: ReactNode; className?: string; as?: ElementType }>;

export default function PageShell({ children, className = '', as: Tag = 'div' }: Props) {
  return <Tag className={`grid-shell z-content ${className}`}>{children}</Tag>;
}
