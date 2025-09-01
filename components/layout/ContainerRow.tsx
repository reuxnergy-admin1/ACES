import type { ReactNode, ElementType } from 'react';

type Props = Readonly<{ children: ReactNode; className?: string; as?: ElementType }>;

export default function ContainerRow({ children, className = '', as: Tag = 'div' }: Props) {
  return <Tag className={`container-row ${className}`}>{children}</Tag>;
}
