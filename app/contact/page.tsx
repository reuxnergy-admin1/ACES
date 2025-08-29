import ContainerRow from '@/components/layout/ContainerRow';
import { Grid12, Span } from '@/components/layout/Grid12';

export default function Page(){
  return (<section className="grid-shell section-band pt-28">
    <ContainerRow>
      <Grid12 data-reveal-blur-stagger>
        <Span cols={8}><h1 className="text-4xl font-light">Request a Quote</h1></Span>
      </Grid12>
    </ContainerRow>
    <ContainerRow className="mt-8">
      <form method="post" action="mailto:info@acesaerodynamics.com" className="w-full">
      <Grid12 data-reveal-blur-stagger>
        <Span cols={6}><input required className="w-full bg-black border border-white/20 rounded px-4 py-3" placeholder="Full name"/></Span>
        <Span cols={6}><input required className="w-full bg-black border border-white/20 rounded px-4 py-3" placeholder="Company"/></Span>
        <Span cols={6}><input required type="email" className="w-full bg-black border border-white/20 rounded px-4 py-3" placeholder="Email"/></Span>
        <Span cols={6}><input className="w-full bg-black border border-white/20 rounded px-4 py-3" placeholder="Phone"/></Span>
        <Span cols={12}><textarea className="w-full bg-black border border-white/20 rounded px-4 py-3" rows={6} placeholder="Project details"></textarea></Span>
        <Span cols={8}><button className="button-primary w-full md:w-auto arrow-shift button--md" type="submit"><span className="btn-tail"><span>Send</span> <span className="arrow" aria-hidden>→</span></span></button></Span>
      </Grid12>
      </form>
    </ContainerRow>
  <p className="container-row mt-4 text-xs text-white/50">This form currently opens your email client to send to info@acesaerodynamics.com. Swap to a server or service when ready.</p>
  </section>);
}
