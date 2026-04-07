"use client";

import dynamic from "next/dynamic";

const CursorTrailGate = dynamic(
  () => import("@/components/CursorTrailGate"),
  { ssr: false, loading: () => null }
);

export default CursorTrailGate;
