import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function SkeletonCard({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className={cn("rounded-3xl border-2 border-border bg-card p-5", className)}>
      {children ?? (
        <div className="space-y-3">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-24 w-full" />
        </div>
      )}
    </div>
  );
}

export function SkeletonHeader({ withAvatar = false }: { withAvatar?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="space-y-2">
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-4 w-32" />
      </div>
      {withAvatar && <Skeleton className="size-24 shrink-0 rounded-full sm:size-32" />}
    </div>
  );
}
