import { Skeleton } from "@/components/ui/skeleton";
import { SkeletonCard } from "@/components/loading/skeleton-card";

export default function ProfileLoading() {
  return (
    <div className="mx-auto max-w-lg space-y-6 p-4 pb-24 sm:p-6">
      <div className="flex items-center gap-4">
        <Skeleton className="size-16 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>
      </div>
      <SkeletonCard>
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-32 rounded-full" />
        </div>
      </SkeletonCard>
      <SkeletonCard>
        <Skeleton className="mb-3 h-4 w-40" />
        <Skeleton className="h-24 w-full" />
      </SkeletonCard>
    </div>
  );
}
