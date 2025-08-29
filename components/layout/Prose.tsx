import type { ReactNode } from 'react';

type Props = Readonly<{ children: ReactNode; className?: string; max?: string }>;

export default function Prose({ children, className = '', max = '72ch' }: Props) {
  return <div className={className} style={{ maxInlineSize: max }}>{children}</div>;
}
