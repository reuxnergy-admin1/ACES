import type { ReactNode, ElementType } from 'react';

type Props = Readonly<{ children: ReactNode; className?: string; as?: ElementType }>;

export default function ContainerWide({ children, className = '', as: Tag = 'div' }: Props) {
  return <Tag className={`container-wide ${className}`}>{children}</Tag>;
}
