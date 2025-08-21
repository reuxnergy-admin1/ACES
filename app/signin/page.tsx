export default function Page(){
  return (<section className="grid-shell pt-36 pb-24">
    <div className="container-row grid-12">
      <h1 className="text-4xl font-light col-span-12 md:col-span-6">Sign In</h1>
      <p className="mt-6 text-white/70 col-span-12 md:col-span-6">Restricted portal for registered customers. If you don&apos;t have access, please <a className="wipe-link" href="/contact/">contact us</a>.</p>
      <form className="mt-8 col-span-12 md:col-span-6 space-y-4">
      <input className="w-full bg-black border border-white/20 rounded px-4 py-3" placeholder="Email address" type="email" required/>
      <input className="w-full bg-black border border-white/20 rounded px-4 py-3" placeholder="Access code" type="password" required/>
      <button className="button-primary w-full" type="submit">Sign In</button>
      </form>
      <p className="mt-4 text-xs text-white/50 col-span-12 md:col-span-6">Form is a placeholder until the secure portal is provisioned.</p>
    </div>
  </section>);
}
