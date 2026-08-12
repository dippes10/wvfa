"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const HeroBall = dynamic(() => import("./hero-ball").then((m) => m.HeroBall), {
  ssr: false,
  loading: () => <Skeleton className="size-full rounded-full" />,
});

export function HeroBallLoader({ className }: { className?: string }) {
  return (
    <div className={cn("size-40 shrink-0 sm:size-56", className)}>
      <HeroBall />
    </div>
  );
}
