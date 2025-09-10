import { OrderForm } from '@/components/OrderForm';
import ContainerRow from '@/components/layout/ContainerRow';
import { Grid12, Span } from '@/components/layout/Grid12';

const PRODUCTS = [
  { id: 'AC-172-FW-WS-01', label: 'Cessna 172 — Front Windscreen' },
  { id: 'AC-R44-DO-02', label: 'Robinson R44 — Door Window' },
  { id: 'MS-GT-LEX-01', label: 'GT — Lexan Windscreen' }
] as const;

export default function Page() {
  return (
    <section className="grid-shell section-band pt-28">
      <ContainerRow>
        <Grid12 data-reveal-blur-stagger>
          <Span cols={6}><OrderForm products={PRODUCTS} /></Span>
          <Span cols={6}>
            <h1 className="text-4xl font-light">Order</h1>
            <p className="mt-6 body text-white/70 max-w-reading">Select a product ID to proceed. If your plan covers this unit, it will deduct from allocation; otherwise you will be routed to payment.</p>
            <p className="mt-4 text-xs text-white/50">Checkout & plan logic to be integrated with your ERP/payment gateway.</p>
          </Span>
        </Grid12>
      </ContainerRow>
    </section>
  );
}
