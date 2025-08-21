export default function Page(){
  return (<section className="mx-auto max-w-6xl px-4 pt-36 pb-24">
    <h1 className="text-4xl md:text-5xl font-light">Services</h1>
    <ul className="mt-6 grid md:grid-cols-2 gap-4 text-white/70 list-disc list-inside">
      <li>Design for manufacturability</li>
      <li>Tooling (CNC patterns, matched dies)</li>
      <li>Thermoforming & annealing</li>
      <li>Edge finishing & drilling</li>
      <li>Coatings (scratch-resistant / anti-fog via approved processes)</li>
      <li>Quality assurance & documentation</li>
    </ul>
  </section>);
}
