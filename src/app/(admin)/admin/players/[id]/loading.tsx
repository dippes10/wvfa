import { Skeleton } from "@/components/ui/skeleton";
import { SkeletonCard } from "@/components/loading/skeleton-card";

export default function AdminPlayerDetailLoading() {
  return (
    <div className="mx-auto max-w-3xl space-y-6 p-4 pb-24 sm:p-6">
      <div className="space-y-2">
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-4 w-56" />
      </div>
      <SkeletonCard className="flex items-center justify-center py-6">
        <Skeleton className="size-32 rounded-full" />
      </SkeletonCard>
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
    </div>
  );
}
