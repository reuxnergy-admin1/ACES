import type { ReactNode, HTMLAttributes } from 'react';

type GridProps = Readonly<{ children: ReactNode; className?: string; gutter?: boolean } & HTMLAttributes<HTMLDivElement>>;

export function Grid12({ children, className = '', gutter = true, ...rest }: GridProps) {
  return (
    <div className={`grid-12 ${gutter ? 'gutter' : ''} ${className}`.trim()} {...rest}>
      {children}
    </div>
  );
}

type SpanProps = Readonly<{ children: ReactNode; className?: string; cols: 4 | 6 | 8 | 12 } & HTMLAttributes<HTMLDivElement>>;

export function Span({ children, className = '', cols, ...rest }: SpanProps) {
  let spanClass: string;
  switch (cols) {
    case 12: spanClass = 'span-12'; break;
    case 8: spanClass = 'span-8'; break;
    case 6: spanClass = 'span-6'; break;
    default: spanClass = 'span-4';
  }
  return (
    <div className={`${spanClass} ${className}`.trim()} {...rest}>
      {children}
    </div>
  );
}
