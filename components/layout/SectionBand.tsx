import { createElement, type ReactNode, type ElementType } from 'react';

type Props = Readonly<{ children: ReactNode; className?: string; as?: ElementType }>;

export default function SectionBand({ children, className = '', as: Tag = 'section' }: Props) {
  return createElement(Tag, { className: `section-band ${className}` }, children);
}
