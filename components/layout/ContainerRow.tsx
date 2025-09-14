import type { ReactNode, ElementType } from 'react';

type Props = Readonly<{ children: ReactNode; className?: string; as?: ElementType }>;

export default function ContainerRow({ children, className = '', as: Tag = 'div' }: Props) {
  const Component = Tag as React.ComponentType<{ className?: string; children?: ReactNode }>;
  return <Component className={`container-row ${className}`}>{children}</Component>;
}
