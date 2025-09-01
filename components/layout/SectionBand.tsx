import type { ReactNode, ElementType } from 'react';

type Props = Readonly<{ children: ReactNode; className?: string; as?: ElementType }>;

export default function SectionBand({ children, className = '', as: Tag = 'section' }: Props) {
  return <Tag className={`section-band ${className}`}>{children}</Tag>;
}
