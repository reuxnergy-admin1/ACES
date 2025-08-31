import type { ReactNode, ElementType } from 'react';

type Props = Readonly<{ children: ReactNode; className?: string; as?: ElementType }>;

export default function PageShell({ children, className = '', as: Tag = 'div' }: Props) {
  const Component = Tag as React.ComponentType<{ className?: string; children?: ReactNode }>;
  return <Component className={`grid-shell z-content ${className}`}>{children}</Component>;
}
