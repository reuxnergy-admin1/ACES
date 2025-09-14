import type { ReactNode, ElementType } from 'react';

type Props = Readonly<{ children: ReactNode; className?: string; as?: ElementType }>;

export default function SectionBand({ children, className = '', as: Tag = 'section' }: Props) {
  const Component = Tag as React.ComponentType<{ className?: string; children?: ReactNode }>;
  return <Component className={`section-band ${className}`}>{children}</Component>;
}
