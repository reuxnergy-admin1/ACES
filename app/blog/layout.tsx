export default function BlogLayout({ children }: { children: React.ReactNode }) {
  // Scope a palette inversion to the blog subtree only. This avoids refactoring components.
  // Note: media elements are counter-inverted in CSS to keep images natural.
  return (
    <section className="theme-invert">
      {children}
    </section>
  );
}
