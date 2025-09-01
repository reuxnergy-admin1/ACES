import type { ReactNode, ElementType } from 'react';

type Props = Readonly<{ children: ReactNode; className?: string; as?: ElementType }>;

export default function ContainerFluid({ children, className = '', as: Tag = 'div' }: Props) {
  return <Tag className={`container-fluid ${className}`}>{children}</Tag>;
}
