export default function Page(){
  return (<section className="grid-shell pt-36 pb-24">
    <div className="container-row grid-12">
      <h1 className="text-4xl font-light col-span-12 md:col-span-8">Request a Quote</h1>
    </div>
  <form className="container-row mt-8 grid-12 gap-4" method="post" action="mailto:info@acesaerodynamics.com">
      <input required className="bg-black border border-white/20 rounded px-4 py-3" placeholder="Full name"/>
      <input required className="bg-black border border-white/20 rounded px-4 py-3" placeholder="Company"/>
      <input required type="email" className="bg-black border border-white/20 rounded px-4 py-3" placeholder="Email"/>
      <input className="bg-black border border-white/20 rounded px-4 py-3" placeholder="Phone"/>
      <textarea className="bg-black border border-white/20 rounded px-4 py-3" rows={6} placeholder="Project details"></textarea>
      <div className="col-span-12 md:col-span-8">
        <button className="button-primary w-full md:w-auto" type="submit">Send</button>
      </div>
    </form>
    <p className="mt-4 text-xs text-white/50">This form currently opens your email client to send to info@acesaerodynamics.com. Swap to a server or service when ready.</p>
  </section>);
}
