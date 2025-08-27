"use client";
import { useId, useState } from 'react';

type Product = { id: string; label: string };

export function OrderForm({ products }: Readonly<{ products: readonly Product[] }>) {
  const [selected, setSelected] = useState(products[0]?.id ?? '');
  const selectId = useId();
  return (
    <form className="mt-8 col-span-12 md:col-span-6 space-y-4">
      <label className="block text-white/70" htmlFor={selectId}>Product</label>
      <select id={selectId} className="w-full bg-black border border-white/20 rounded px-4 py-3" value={selected} onChange={(e)=>setSelected(e.target.value)}>
        {products.map(p => (<option key={p.id} value={p.id}>{p.label} ({p.id})</option>))}
      </select>
      <button className="button-primary w-full" type="button">Proceed</button>
    </form>
  );
}
