import type { ReactNode, HTMLAttributes } from "react";

type Props = Readonly<
  { children: ReactNode; className?: string } & HTMLAttributes<HTMLDivElement>
>;

export default function ContainerWide({
  children,
  className = "",
  ...rest
}: Props) {
  return (
    <div className={`container-wide ${className}`.trim()} {...rest}>
      {children}
    </div>
  );
}
