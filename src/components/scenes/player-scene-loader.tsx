"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const PlayerScene = dynamic(() => import("./player-scene").then((m) => m.PlayerScene), {
  ssr: false,
  loading: () => <Skeleton className="size-full rounded-full" />,
});

export function PlayerSceneLoader({
  celebrate = false,
  className,
}: {
  celebrate?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("size-24 shrink-0 sm:size-32", className)}>
      <PlayerScene celebrate={celebrate} />
    </div>
  );
}
