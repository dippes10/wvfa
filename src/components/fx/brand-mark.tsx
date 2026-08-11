import { Shield } from "lucide-react";
import { cn } from "@/lib/utils";

export function BrandMark({ className, iconClassName }: { className?: string; iconClassName?: string }) {
  return (
    <span
      className={cn(
        "flex items-center justify-center rounded-full border border-primary/40 bg-metallic-gold shadow-inner",
        className,
      )}
    >
      <Shield
        className={cn("fill-primary-foreground/10 text-primary-foreground", iconClassName)}
        strokeWidth={2.25}
      />
    </span>
  );
}
