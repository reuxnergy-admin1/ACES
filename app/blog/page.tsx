import BlogFilters from '@/components/BlogFilters';
import ContainerWide from '@/components/layout/ContainerWide';
import { Grid12, Span } from '@/components/layout/Grid12';

export default function Page(){
  return (
    <section className="grid-shell section-band pt-28 theme-invert">
      <ContainerWide>
        <Grid12 data-reveal-blur-stagger>
          <Span cols={8}><h1 className="text-4xl md:text-5xl font-light">Blog</h1></Span>
          <Span cols={8}><p className="mt-6 text-white/70">Blog is wired for Decap CMS. Add posts under <code>/content/blog</code>.</p></Span>
        </Grid12>
      </ContainerWide>
      <BlogFilters />
    </section>
  );
}
