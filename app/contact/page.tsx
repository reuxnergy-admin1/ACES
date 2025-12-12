"use client";

import ContainerRow from "@/components/layout/ContainerRow";
import SectionBand from "@/components/layout/SectionBand";
import { Grid12, Span } from "@/components/layout/Grid12";
import { useState, FormEvent } from "react";

export default function Page() {
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("submitting");

    const form = e.currentTarget;
    const formData = new FormData(form);

    const data = {
      name: formData.get("name") as string,
      company: formData.get("company") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      details: formData.get("details") as string,
    };

    try {
      const response = await fetch("/api/contact/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setStatus("success");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <>
      {/* Hero section */}
      <SectionBand className="!pt-[140px] sm:!pt-[150px] lg:!pt-[160px]">
        <ContainerRow>
          <Grid12 data-reveal-blur-stagger>
            <Span cols={12} className="text-center md:text-left">
              <h1 className="text-4xl font-light">Request a Quote</h1>
            </Span>
          </Grid12>
        </ContainerRow>
      </SectionBand>

      {/* Form section */}
      <SectionBand>
        <ContainerRow>
          {status === "success" ? (
            <div className="text-center py-12">
              <h2 className="text-2xl font-light mb-4">
                Thank you for your enquiry!
              </h2>
              <p className="text-white/70">
                We&apos;ll get back to you as soon as possible.
              </p>
              <button
                onClick={() => setStatus("idle")}
                className="mt-6 text-white/60 hover:text-white underline"
              >
                Submit another enquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="w-full">
              <Grid12 data-reveal-blur-stagger>
                <Span cols={6}>
                  <label
                    htmlFor="name"
                    className="block text-white/60 text-sm mb-2"
                  >
                    Full name *
                  </label>
                  <input
                    id="name"
                    name="name"
                    required
                    className="w-full bg-black border border-white/20 rounded px-4 py-3 min-h-[48px]"
                    placeholder="Your full name"
                    disabled={status === "submitting"}
                  />
                </Span>
                <Span cols={6}>
                  <label
                    htmlFor="company"
                    className="block text-white/60 text-sm mb-2"
                  >
                    Company *
                  </label>
                  <input
                    id="company"
                    name="company"
                    required
                    className="w-full bg-black border border-white/20 rounded px-4 py-3 min-h-[48px]"
                    placeholder="Your company name"
                    disabled={status === "submitting"}
                  />
                </Span>
                <Span cols={6}>
                  <label
                    htmlFor="email"
                    className="block text-white/60 text-sm mb-2"
                  >
                    Email *
                  </label>
                  <input
                    id="email"
                    name="email"
                    required
                    type="email"
                    className="w-full bg-black border border-white/20 rounded px-4 py-3 min-h-[48px]"
                    placeholder="your@email.com"
                    disabled={status === "submitting"}
                  />
                </Span>
                <Span cols={6}>
                  <label
                    htmlFor="phone"
                    className="block text-white/60 text-sm mb-2"
                  >
                    Phone
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    className="w-full bg-black border border-white/20 rounded px-4 py-3 min-h-[48px]"
                    placeholder="+27 ..."
                    disabled={status === "submitting"}
                  />
                </Span>
                <Span cols={12}>
                  <label
                    htmlFor="details"
                    className="block text-white/60 text-sm mb-2"
                  >
                    Project details *
                  </label>
                  <textarea
                    id="details"
                    name="details"
                    required
                    className="w-full bg-black border border-white/20 rounded px-4 py-3"
                    rows={6}
                    placeholder="Tell us about your project requirements..."
                    disabled={status === "submitting"}
                  ></textarea>
                </Span>
                <Span cols={8}>
                  {status === "error" && (
                    <p className="text-red-400 mb-4">
                      Something went wrong. Please try again.
                    </p>
                  )}
                  <button
                    className="button-primary w-full md:w-auto h-11 px-5 whitespace-nowrap disabled:opacity-50"
                    type="submit"
                    disabled={status === "submitting"}
                  >
                    <span aria-hidden="true" className="reveal-line h top" />
                    <span aria-hidden="true" className="reveal-line h bottom" />
                    <span aria-hidden="true" className="reveal-line v left" />
                    <span aria-hidden="true" className="reveal-line v right" />
                    <span className="sr-only">
                      {status === "submitting"
                        ? "Sending..."
                        : "Send Quote Request"}
                    </span>
                    <span aria-hidden="true">
                      {status === "submitting"
                        ? "Sending..."
                        : "Send Quote Request"}
                    </span>
                  </button>
                </Span>
              </Grid12>
            </form>
          )}
        </ContainerRow>
      </SectionBand>
    </>
  );
}
