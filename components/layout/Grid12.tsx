import { createElement, type ReactNode, type ElementType, type HTMLAttributes } from 'react';

type GridProps = Readonly<{ children: ReactNode; className?: string; as?: ElementType; gutter?: boolean } & HTMLAttributes<HTMLDivElement>>;

export function Grid12({ children, className = '', as: Tag = 'div', gutter = true, ...rest }: GridProps) {
  return createElement(Tag, { className: `grid-12 ${gutter ? 'gutter' : ''} ${className}`.trim(), ...rest }, children);
}

type SpanProps = Readonly<{ children: ReactNode; className?: string; cols: 4 | 6 | 8 | 12; as?: ElementType } & HTMLAttributes<HTMLDivElement>>;

export function Span({ children, className = '', cols, as: Tag = 'div', ...rest }: SpanProps) {
  let spanClass: string;
  switch (cols) {
    case 12: spanClass = 'span-12'; break;
    case 8: spanClass = 'span-8'; break;
    case 6: spanClass = 'span-6'; break;
    default: spanClass = 'span-4';
  }
  return createElement(Tag, { className: `${spanClass} ${className}`, ...rest }, children);
}
