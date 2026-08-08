import { Skeleton } from "@/components/ui/skeleton";
import { SkeletonCard } from "@/components/loading/skeleton-card";

export default function ParentLoading() {
  return (
    <div className="mx-auto max-w-3xl space-y-6 p-4 pb-24 sm:p-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-4 w-72" />
      </div>
      {[0, 1].map((i) => (
        <SkeletonCard key={i}>
          <Skeleton className="mb-4 h-5 w-40" />
          <div className="grid gap-4 sm:grid-cols-2">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
        </SkeletonCard>
      ))}
    </div>
  );
}
