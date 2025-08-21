export default function Page(){
  return (<section className="mx-auto max-w-2xl px-4 pt-36 pb-24">
    <h1 className="text-4xl font-light">Request a Quote</h1>
    <form className="mt-8 grid grid-cols-1 gap-4" method="post" action="mailto:info@acesaerodynamics.com">
      <input required className="bg-black border border-white/20 rounded px-4 py-3" placeholder="Full name"/>
      <input required className="bg-black border border-white/20 rounded px-4 py-3" placeholder="Company"/>
      <input required type="email" className="bg-black border border-white/20 rounded px-4 py-3" placeholder="Email"/>
      <input className="bg-black border border-white/20 rounded px-4 py-3" placeholder="Phone"/>
      <textarea className="bg-black border border-white/20 rounded px-4 py-3" rows={6} placeholder="Project details"></textarea>
      <button className="button-primary" type="submit">Send</button>
    </form>
    <p className="mt-4 text-xs text-white/50">This form currently opens your email client to send to info@acesaerodynamics.com. Swap to a server or service when ready.</p>
  </section>);
}
