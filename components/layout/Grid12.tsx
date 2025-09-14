import type { ReactNode, ElementType } from 'react';

type GridProps = Readonly<{ children: ReactNode; className?: string; as?: ElementType; gutter?: boolean }>;

export function Grid12({ children, className = '', as: Tag = 'div', gutter = true }: GridProps) {
  const Component = Tag as React.ComponentType<{ className?: string; children?: ReactNode }>;
  return <Component className={`grid-12 ${gutter ? 'gutter' : ''} ${className}`.trim()}>{children}</Component>;
}

type SpanProps = Readonly<{ children: ReactNode; className?: string; cols: 4 | 6 | 8 | 12; as?: ElementType }>;

export function Span({ children, className = '', cols, as: Tag = 'div' }: SpanProps) {
  let spanClass: string;
  switch (cols) {
    case 12: spanClass = 'span-12'; break;
    case 8: spanClass = 'span-8'; break;
    case 6: spanClass = 'span-6'; break;
    default: spanClass = 'span-4';
  }
  const Component = Tag as React.ComponentType<{ className?: string; children?: ReactNode }>;
  return <Component className={`${spanClass} ${className}`}>{children}</Component>;
}
