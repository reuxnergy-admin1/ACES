export default function Page(){
  return (<section className="grid-shell pt-36 pb-24">
    <div className="container-row grid-12">
      <h1 className="text-4xl md:text-5xl font-light col-span-12 md:col-span-8">Services</h1>
    </div>
  <ul className="container-row mt-6 grid-12 text-white/70 list-disc list-inside">
      <li className="col-span-12 md:col-span-6">Design for manufacturability</li>
      <li className="col-span-12 md:col-span-6">Tooling (CNC patterns, matched dies)</li>
      <li className="col-span-12 md:col-span-6">Thermoforming & annealing</li>
      <li className="col-span-12 md:col-span-6">Edge finishing & drilling</li>
      <li className="col-span-12 md:col-span-6">Coatings (scratch-resistant / anti-fog via approved processes)</li>
      <li className="col-span-12 md:col-span-6">Quality assurance & documentation</li>
    </ul>
  </section>);
}
