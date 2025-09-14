import { createElement, type ReactNode, type ElementType, type HTMLAttributes } from 'react';

type Props = Readonly<{ children: ReactNode; className?: string; as?: ElementType } & HTMLAttributes<HTMLDivElement>>;

export default function ContainerWide({ children, className = '', as: Tag = 'div', ...rest }: Props) {
  return createElement(Tag, { className: `container-wide ${className}`, ...rest }, children);
}
