import type { ReactNode, HTMLAttributes } from 'react';

type Props = Readonly<{ children: ReactNode; className?: string } & HTMLAttributes<HTMLElement>>;

export default function SectionBand({ children, className = '', ...rest }: Props) {
  return (
    <section className={`section-band ${className}`.trim()} {...rest}>
      {children}
    </section>
  );
}
