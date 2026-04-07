"use client";

import dynamic from "next/dynamic";

const InViewReveals = dynamic(
  () => import("@/components/InViewReveals"),
  { ssr: false, loading: () => null }
);

export default InViewReveals;
