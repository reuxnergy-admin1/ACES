import type { ReactNode, ElementType } from 'react';

type Props = Readonly<{ children: ReactNode; className?: string; as?: ElementType; max?: string }>;

export default function Prose({ children, className = '', as: Tag = 'div', max = '72ch' }: Props) {
  const Component = Tag as React.ComponentType<{ className?: string; children?: ReactNode; style?: React.CSSProperties }>;
  return <Component className={className} style={{ maxInlineSize: max }}>{children}</Component>;
}
