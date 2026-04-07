"use client";

import dynamic from "next/dynamic";

const ResponsiveContours = dynamic(
  () => import("@/components/ResponsiveContours"),
  { ssr: false, loading: () => null }
);

export default ResponsiveContours;
