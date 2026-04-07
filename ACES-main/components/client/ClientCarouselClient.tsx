"use client";

import dynamic from "next/dynamic";

const ClientCarousel = dynamic(
  () => import("@/components/ClientCarousel"),
  {
    ssr: false,
    loading: () => <div className="h-32 animate-pulse bg-white/5 rounded-lg" />,
  }
);

export default ClientCarousel;
