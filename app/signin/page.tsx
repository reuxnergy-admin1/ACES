import ContainerRow from "@/components/layout/ContainerRow";
import { Grid12, Span } from "@/components/layout/Grid12";

export default function Page() {
  return (
    <section className="grid-shell section-band pt-28">
      <ContainerRow>
        <Grid12 data-reveal-blur-stagger>
          <Span cols={6}>
            <h1 className="text-4xl font-light">Sign In</h1>
          </Span>
          <Span cols={6}>
            <p className="mt-6 body text-white/70 max-w-reading">
              Restricted portal for registered customers. If you don&apos;t have
              access, please{" "}
              <a className="link-underline" href="/contact/">
                contact us
              </a>
              .
            </p>
          </Span>
          <Span cols={6}>
            <form className="mt-8 space-y-4">
              <input
                className="w-full bg-black border border-white/20 rounded px-4 py-3"
                placeholder="Email address"
                type="email"
                required
              />
              <input
                className="w-full bg-black border border-white/20 rounded px-4 py-3"
                placeholder="Access code"
                type="password"
                required
              />
              <button className="button-primary w-full h-11 px-5" type="submit">
                <span aria-hidden="true" className="reveal-line h top" />
                <span aria-hidden="true" className="reveal-line h bottom" />
                <span aria-hidden="true" className="reveal-line v left" />
                <span aria-hidden="true" className="reveal-line v right" />
                <span className="sr-only">Sign In</span>
                <span aria-hidden>Sign In</span>
              </button>
            </form>
          </Span>
          <Span cols={6}>
            <p className="mt-4 text-xs text-white/50">
              Form is a placeholder until the secure portal is provisioned.
            </p>
          </Span>
        </Grid12>
      </ContainerRow>
    </section>
  );
}
