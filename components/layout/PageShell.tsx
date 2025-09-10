import type { ReactNode, HTMLAttributes } from 'react';

type Props = Readonly<{ children: ReactNode; className?: string } & HTMLAttributes<HTMLDivElement>>;

export default function PageShell({ children, className = '', ...rest }: Props) {
  return (
    <div className={`grid-shell z-content ${className}`.trim()} {...rest}>
      {children}
    </div>
  );
}
