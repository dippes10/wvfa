import { Skeleton } from "@/components/ui/skeleton";
import { SkeletonCard } from "@/components/loading/skeleton-card";

export default function LoadPageLoading() {
  return (
    <div className="mx-auto max-w-3xl space-y-6 p-4 pb-24 sm:p-6">
      <Skeleton className="h-8 w-48" />
      <SkeletonCard>
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-10 w-full rounded-full" />
        </div>
      </SkeletonCard>
      <SkeletonCard>
        <Skeleton className="mb-3 h-4 w-24" />
        <Skeleton className="h-56 w-full" />
      </SkeletonCard>
      <SkeletonCard>
        <Skeleton className="mb-3 h-4 w-24" />
        <Skeleton className="h-40 w-full" />
      </SkeletonCard>
    </div>
  );
}
