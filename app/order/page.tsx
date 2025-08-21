'use client';
import { useState } from 'react';

const PRODUCTS = [
  { id: 'AC-172-FW-WS-01', label: 'Cessna 172 — Front Windscreen' },
  { id: 'AC-R44-DO-02', label: 'Robinson R44 — Door Window' },
  { id: 'MS-GT-LEX-01', label: 'GT — Lexan Windscreen' }
];

export default function Page(){
  const [selected, setSelected] = useState(PRODUCTS[0].id);
  return (<section className="mx-auto max-w-xl px-4 pt-36 pb-24">
    <h1 className="text-4xl font-light">Order</h1>
    <p className="mt-6 text-white/70">Select a product ID to proceed. If your plan covers this unit, it will deduct from allocation; otherwise you will be routed to payment.</p>
    <form className="mt-8 space-y-4">
      <label className="block text-white/70">Product</label>
      <select className="w-full bg-black border border-white/20 rounded px-4 py-3" value={selected} onChange={(e)=>setSelected(e.target.value)}>
        {PRODUCTS.map(p=>(<option key={p.id} value={p.id}>{p.label} ({p.id})</option>))}
      </select>
      <button className="button-primary w-full" type="button">Proceed</button>
    </form>
    <p className="mt-4 text-xs text-white/50">Checkout & plan logic to be integrated with your ERP/payment gateway.</p>
  </section>);
}
