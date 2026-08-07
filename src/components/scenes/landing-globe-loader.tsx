"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

const LandingGlobe = dynamic(
  () => import("./landing-globe").then((m) => m.LandingGlobe),
  {
    ssr: false,
    loading: () => <Skeleton className="h-[420px] w-full rounded-3xl" />,
  },
);

export function LandingGlobeLoader() {
  return <LandingGlobe />;
}
