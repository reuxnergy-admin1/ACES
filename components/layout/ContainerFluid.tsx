import type { ReactNode, ElementType } from 'react';

type Props = { children: ReactNode; className?: string; as?: ElementType };

export default function ContainerFluid({ children, className = '', as: Tag = 'div' }: Props) {
  const Component = Tag as React.ComponentType<{ className?: string; children?: ReactNode }>;
  return <Component className={`container-fluid ${className}`}>{children}</Component>;
}
