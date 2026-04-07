export default function BlogPostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Invert colors for blog inner pages too.
  return <section className="theme-invert">{children}</section>;
}
