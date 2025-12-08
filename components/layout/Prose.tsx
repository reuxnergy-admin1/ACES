import type { CSSProperties, ReactNode, HTMLAttributes } from "react";

type Props = Readonly<
  {
    children: ReactNode;
    className?: string;
    max?: string;
    style?: CSSProperties;
  } & HTMLAttributes<HTMLDivElement>
>;

export default function Prose({
  children,
  className = "",
  max = "72ch",
  style,
  ...rest
}: Props) {
  return (
    <div
      className={`body ${className}`.trim()}
      style={{ maxInlineSize: max, ...(style || {}) }}
      {...rest}
    >
      {children}
    </div>
  );
}
