'use client';

import ContainerRow from '@/components/layout/ContainerRow';
import SectionBand from '@/components/layout/SectionBand';
import { Grid12, Span } from '@/components/layout/Grid12';
import { useId, useState, FormEvent } from 'react';

export default function Page(){
  const uid = useId();
  const idName = `${uid}-name`;
  const idCompany = `${uid}-company`;
  const idEmail = `${uid}-email`;
  const idPhone = `${uid}-phone`;
  const idDetails = `${uid}-details`;
  
  const [company, setCompany] = useState('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    const form = e.currentTarget;
    const formData = new FormData(form);
    const companyName = formData.get('company') as string || 'Unknown';
    const subject = encodeURIComponent(`Website Lead – ${companyName}`);
    const body = encodeURIComponent(
      `Name: ${formData.get('name')}\n` +
      `Company: ${companyName}\n` +
      `Email: ${formData.get('email')}\n` +
      `Phone: ${formData.get('phone') || 'Not provided'}\n\n` +
      `Project Details:\n${formData.get('details')}`
    );
    window.location.href = `mailto:info@acesaerodynamics.com?subject=${subject}&body=${body}`;
    e.preventDefault();
  };

  return (
    <>
      {/* Hero section */}
      <SectionBand className="pt-36 md:pt-40">
        <ContainerRow>
          <Grid12 data-reveal-blur-stagger>
            <Span cols={8}><h1 className="text-4xl font-light">Request a Quote</h1></Span>
          </Grid12>
        </ContainerRow>
      </SectionBand>

      {/* Form section */}
      <SectionBand>
        <ContainerRow>
          <form onSubmit={handleSubmit} className="w-full" noValidate>
            <Grid12 data-reveal-blur-stagger>
              <Span cols={6}>
                <label htmlFor={idName} className="block text-white/60 text-sm mb-2">Full name *</label>
                <input id={idName} name="name" required className="w-full bg-black border border-white/20 rounded px-4 py-3 min-h-[48px]" placeholder="Your full name"/>
              </Span>
              <Span cols={6}>
                <label htmlFor={idCompany} className="block text-white/60 text-sm mb-2">Company *</label>
                <input 
                  id={idCompany} 
                  name="company" 
                  required 
                  className="w-full bg-black border border-white/20 rounded px-4 py-3 min-h-[48px]" 
                  placeholder="Your company name"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                />
              </Span>
              <Span cols={6}>
                <label htmlFor={idEmail} className="block text-white/60 text-sm mb-2">Email *</label>
                <input id={idEmail} name="email" required type="email" className="w-full bg-black border border-white/20 rounded px-4 py-3 min-h-[48px]" placeholder="your@email.com"/>
              </Span>
              <Span cols={6}>
                <label htmlFor={idPhone} className="block text-white/60 text-sm mb-2">Phone</label>
                <input id={idPhone} name="phone" className="w-full bg-black border border-white/20 rounded px-4 py-3 min-h-[48px]" placeholder="+27 ..."/>
              </Span>
              <Span cols={12}>
                <label htmlFor={idDetails} className="block text-white/60 text-sm mb-2">Project details *</label>
                <textarea id={idDetails} name="details" required className="w-full bg-black border border-white/20 rounded px-4 py-3" rows={6} placeholder="Tell us about your project requirements..."></textarea>
              </Span>
              <Span cols={8}>
                <button className="button-primary w-full md:w-auto h-11 px-5 whitespace-nowrap" type="submit">
                  <span aria-hidden="true" className="reveal-line h top" />
                  <span aria-hidden="true" className="reveal-line h bottom" />
                  <span aria-hidden="true" className="reveal-line v left" />
                  <span aria-hidden="true" className="reveal-line v right" />
                  <span className="sr-only">Send Quote Request</span>
                  <span aria-hidden="true">Send Quote Request</span>
                </button>
              </Span>
            </Grid12>
          </form>
        </ContainerRow>
      </SectionBand>
    </>
  );
}
