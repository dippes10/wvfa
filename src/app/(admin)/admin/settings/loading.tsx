import { Skeleton } from "@/components/ui/skeleton";
import { SkeletonCard } from "@/components/loading/skeleton-card";

export default function AdminSettingsLoading() {
  return (
    <div className="mx-auto max-w-2xl space-y-6 p-4 pb-24 sm:p-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-4 w-80" />
      </div>
      <SkeletonCard>
        <div className="grid gap-4 sm:grid-cols-2">
          {[0, 1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      </SkeletonCard>
    </div>
  );
}
