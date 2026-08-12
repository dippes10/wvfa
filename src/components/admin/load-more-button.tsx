import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LoadMoreButton({
  onClick,
  loading,
  label = "Load 10 more",
}: {
  onClick: () => void;
  loading: boolean;
  label?: string;
}) {
  return (
    <div className="flex justify-center pt-2">
      <Button variant="outline" size="sm" onClick={onClick} disabled={loading}>
        {loading && <Loader2 className="size-4 animate-spin" />}
        {label}
      </Button>
    </div>
  );
}
