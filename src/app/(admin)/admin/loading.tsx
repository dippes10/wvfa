import { Skeleton } from "@/components/ui/skeleton";
import { SkeletonCard } from "@/components/loading/skeleton-card";

export default function AdminOverviewLoading() {
  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4 pb-24 sm:p-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-4 w-72" />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <SkeletonCard className="h-24" />
        <SkeletonCard className="h-24" />
        <SkeletonCard className="h-24" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <SkeletonCard>
          <Skeleton className="mb-3 h-4 w-32" />
          <Skeleton className="h-56 w-full" />
        </SkeletonCard>
        <SkeletonCard>
          <Skeleton className="mb-3 h-4 w-32" />
          <Skeleton className="h-56 w-full" />
        </SkeletonCard>
      </div>
      <SkeletonCard>
        <Skeleton className="mb-3 h-4 w-40" />
        <Skeleton className="h-32 w-full" />
      </SkeletonCard>
    </div>
  );
}
