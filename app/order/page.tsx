import { OrderForm } from '@/components/OrderForm';

const PRODUCTS = [
  { id: 'AC-172-FW-WS-01', label: 'Cessna 172 — Front Windscreen' },
  { id: 'AC-R44-DO-02', label: 'Robinson R44 — Door Window' },
  { id: 'MS-GT-LEX-01', label: 'GT — Lexan Windscreen' }
] as const;

export default function Page(){
  return (
    <section className="grid-shell pt-36 pb-24">
      <div className="container-row grid-12">
        <h1 className="text-4xl font-light col-span-12 md:col-span-6">Order</h1>
        <p className="mt-6 text-white/70 col-span-12 md:col-span-6">Select a product ID to proceed. If your plan covers this unit, it will deduct from allocation; otherwise you will be routed to payment.</p>
        <OrderForm products={PRODUCTS} />
        <p className="mt-4 text-xs text-white/50 col-span-12 md:col-span-6">Checkout & plan logic to be integrated with your ERP/payment gateway.</p>
      </div>
    </section>
  );
}
