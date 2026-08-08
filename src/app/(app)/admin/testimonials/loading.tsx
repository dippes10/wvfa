import { Skeleton } from "@/components/ui/skeleton";
import { SkeletonCard } from "@/components/loading/skeleton-card";

export default function AdminTestimonialsLoading() {
  return (
    <div className="mx-auto max-w-4xl space-y-6 p-4 pb-24 sm:p-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-72" />
      </div>
      <SkeletonCard>
        <Skeleton className="mb-3 h-4 w-32" />
        <div className="space-y-3">
          {[0, 1].map((i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      </SkeletonCard>
      <SkeletonCard>
        <Skeleton className="mb-3 h-4 w-24" />
        <Skeleton className="h-16 w-full" />
      </SkeletonCard>
    </div>
  );
}
