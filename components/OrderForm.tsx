"use client";
import { useId, useState } from "react";
import { useToast } from "@/components/ui/ToastProvider";
import Listbox, { type LBOption } from "@/components/ui/Listbox";

type Product = { id: string; label: string };

export function OrderForm({
  products,
}: Readonly<{ products: readonly Product[] }>) {
  const [selected, setSelected] = useState(products[0]?.id ?? "");
  const selectId = useId();
  const opts: LBOption[] = products.map((p) => ({
    value: p.id,
    label: `${p.label} (${p.id})`,
  }));
  const { show } = useToast();
  return (
    <form className="mt-8 md:col-span-6 space-y-4">
      <label className="block text-white/70" htmlFor={selectId}>
        Product
      </label>
      {/* Hidden input ensures form compatibility if needed */}
      <Listbox
        name="product"
        options={opts}
        value={selected}
        onChange={setSelected}
      />
      <button
        className="button-primary w-full h-11 px-5"
        type="button"
        onClick={() => {
          show("Ordering flow coming soon. We will contact you shortly.", {
            variant: "success",
          });
        }}
      >
        <span aria-hidden="true" className="reveal-line h top" />
        <span aria-hidden="true" className="reveal-line h bottom" />
        <span aria-hidden="true" className="reveal-line v left" />
        <span aria-hidden="true" className="reveal-line v right" />
        <span className="sr-only">Proceed</span>
        <span aria-hidden>Proceed</span>
      </button>
    </form>
  );
}
