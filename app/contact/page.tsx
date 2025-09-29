import ContainerRow from '@/components/layout/ContainerRow';
import SectionBand from '@/components/layout/SectionBand';
import { Grid12, Span } from '@/components/layout/Grid12';
import { useId } from 'react';

export default function Page(){
  const uid = useId();
  const idName = `${uid}-name`;
  const idCompany = `${uid}-company`;
  const idEmail = `${uid}-email`;
  const idPhone = `${uid}-phone`;
  const idDetails = `${uid}-details`;
  return (
    <>
      {/* Hero section */}
      <SectionBand className="pt-28">
        <ContainerRow>
          <Grid12 data-reveal-blur-stagger>
            <Span cols={8}><h1 className="text-4xl font-light">Request a Quote</h1></Span>
          </Grid12>
        </ContainerRow>
      </SectionBand>

      {/* Form section */}
      <SectionBand>
        <ContainerRow>
          <form method="post" action="mailto:info@acesaerodynamics.com" className="w-full" noValidate>
            <Grid12 data-reveal-blur-stagger>
              <Span cols={6}>
                <label htmlFor={idName} className="sr-only">Full name</label>
                <input id={idName} name="name" required className="w-full bg-black border border-white/20 rounded px-4 py-3" placeholder="Full name"/>
              </Span>
              <Span cols={6}>
                <label htmlFor={idCompany} className="sr-only">Company</label>
                <input id={idCompany} name="company" required className="w-full bg-black border border-white/20 rounded px-4 py-3" placeholder="Company"/>
              </Span>
              <Span cols={6}>
                <label htmlFor={idEmail} className="sr-only">Email</label>
                <input id={idEmail} name="email" required type="email" className="w-full bg-black border border-white/20 rounded px-4 py-3" placeholder="Email"/>
              </Span>
              <Span cols={6}>
                <label htmlFor={idPhone} className="sr-only">Phone</label>
                <input id={idPhone} name="phone" className="w-full bg-black border border-white/20 rounded px-4 py-3" placeholder="Phone"/>
              </Span>
              <Span cols={12}>
                <label htmlFor={idDetails} className="sr-only">Project details</label>
                <textarea id={idDetails} name="details" className="w-full bg-black border border-white/20 rounded px-4 py-3" rows={6} placeholder="Project details"></textarea>
              </Span>
              <Span cols={8}>
                <button className="button-primary w-full md:w-auto h-11 px-5" type="submit">
                  <span aria-hidden="true" className="reveal-line h top" />
                  <span aria-hidden="true" className="reveal-line h bottom" />
                  <span aria-hidden="true" className="reveal-line v left" />
                  <span aria-hidden="true" className="reveal-line v right" />
                  <span className="sr-only">Send</span>
                  <span aria-hidden>Send</span>
                </button>
              </Span>
            </Grid12>
            <p className="mt-[var(--stack-sm)] body text-white/50 max-w-reading">This form currently opens your email client to send to info@acesaerodynamics.com. Swap to a server or service when ready.</p>
          </form>
        </ContainerRow>
      </SectionBand>
    </>
  );
}
