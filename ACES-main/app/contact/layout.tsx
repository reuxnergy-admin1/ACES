import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Request a Quote",
  description:
    "Contact ACES Aerodynamics in Potchefstroom, South Africa for aircraft transparencies, helicopter windows, and composite components. Get a quote for your aerospace or motorsport project.",
};

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
