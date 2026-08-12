"use client";

import { Trash2 } from "lucide-react";
import { usePaginatedList } from "@/hooks/use-paginated-list";
import { loadMoreSleepEntriesAction } from "@/lib/actions/pagination-actions";
import { removeSleepEntry } from "@/lib/actions/sleep-actions";
import { LoadMoreButton } from "@/components/admin/load-more-button";
import type { SleepEntry } from "@/lib/services/sleepService";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function SleepHistoryTable({
  playerId,
  initialItems,
  initialHasMore,
}: {
  playerId: string;
  initialItems: SleepEntry[];
  initialHasMore: boolean;
}) {
  const { items, hasMore, isPending, loadMore } = usePaginatedList(
    initialItems,
    initialHasMore,
    (offset) => loadMoreSleepEntriesAction(playerId, offset),
  );

  if (items.length === 0) {
    return <p className="text-sm text-muted-foreground">No nights logged yet.</p>;
  }

  return (
    <div className="space-y-3">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Quality</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell>{entry.entry_date}</TableCell>
                <TableCell>{entry.duration_hours}h</TableCell>
                <TableCell>{entry.quality}/10</TableCell>
                <TableCell>
                  <form action={removeSleepEntry.bind(null, entry.id)}>
                    <Button variant="ghost" size="icon" type="submit" aria-label="Delete entry">
                      <Trash2 className="size-4" />
                    </Button>
                  </form>
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
