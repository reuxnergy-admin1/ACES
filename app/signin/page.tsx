export default function Page(){
  return (<section className="mx-auto max-w-md px-4 pt-36 pb-24">
    <h1 className="text-4xl font-light">Sign In</h1>
  <p className="mt-6 text-white/70">Restricted portal for registered customers. If you don&apos;t have access, please <a className="wipe-link" href="/contact/">contact us</a>.</p>
    <form className="mt-8 space-y-4">
      <input className="w-full bg-black border border-white/20 rounded px-4 py-3" placeholder="Email address" type="email" required/>
      <input className="w-full bg-black border border-white/20 rounded px-4 py-3" placeholder="Access code" type="password" required/>
      <button className="button-primary w-full" type="submit">Sign In</button>
    </form>
    <p className="mt-4 text-xs text-white/50">Form is a placeholder until the secure portal is provisioned.</p>
  </section>);
}
