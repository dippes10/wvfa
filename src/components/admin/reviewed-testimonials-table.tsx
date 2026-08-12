"use client";

import { usePaginatedList } from "@/hooks/use-paginated-list";
import { loadMoreReviewedTestimonialsAction } from "@/lib/actions/pagination-actions";
import { LoadMoreButton } from "@/components/admin/load-more-button";
import type { Testimonial } from "@/lib/services/testimonialService";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const statusVariant: Record<string, "default" | "destructive"> = {
  approved: "default",
  rejected: "destructive",
};

export function ReviewedTestimonialsTable({
  initialItems,
  initialHasMore,
}: {
  initialItems: Testimonial[];
  initialHasMore: boolean;
}) {
  const { items, hasMore, isPending, loadMore } = usePaginatedList(
    initialItems,
    initialHasMore,
    loadMoreReviewedTestimonialsAction,
  );

  if (items.length === 0) {
    return <p className="text-sm text-muted-foreground">No reviewed testimonials yet.</p>;
  }

  return (
    <div className="space-y-3">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Author</TableHead>
              <TableHead>Quote</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((t) => (
              <TableRow key={t.id}>
                <TableCell>
                  <p className="font-medium">{t.author_name}</p>
                  <p className="text-xs text-muted-foreground">{t.designation}</p>
                </TableCell>
                <TableCell className="max-w-sm">
                  <p className="line-clamp-2 text-muted-foreground">{t.quote}</p>
                </TableCell>
                <TableCell>
                  <Badge variant={statusVariant[t.status]}>{t.status}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {hasMore && <LoadMoreButton onClick={loadMore} loading={isPending} />}
    </div>
  );
}
