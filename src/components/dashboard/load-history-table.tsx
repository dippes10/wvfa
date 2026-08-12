"use client";

import { Trash2 } from "lucide-react";
import { usePaginatedList } from "@/hooks/use-paginated-list";
import { loadMoreLoadEntriesAction } from "@/lib/actions/pagination-actions";
import { removeLoadEntry } from "@/lib/actions/load-actions";
import { LoadMoreButton } from "@/components/admin/load-more-button";
import type { LoadEntry } from "@/lib/services/loadService";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function LoadHistoryTable({
  playerId,
  ownerId,
  initialItems,
  initialHasMore,
}: {
  playerId: string;
  ownerId: string;
  initialItems: LoadEntry[];
  initialHasMore: boolean;
}) {
  const { items, hasMore, isPending, loadMore } = usePaginatedList(
    initialItems,
    initialHasMore,
    (offset) => loadMoreLoadEntriesAction(playerId, offset),
  );

  if (items.length === 0) {
    return <p className="text-sm text-muted-foreground">No sessions logged yet.</p>;
  }

  return (
    <div className="space-y-3">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Activity</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>RPE</TableHead>
              <TableHead>Load</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell>{entry.activity_date}</TableCell>
                <TableCell>
                  <p>{entry.description}</p>
                  {entry.notes && (
                    <p className="mt-0.5 max-w-52 text-xs text-muted-foreground">{entry.notes}</p>
                  )}
                  {entry.logged_by && entry.logged_by !== ownerId && (
                    <Badge variant="secondary" className="mt-1 text-[10px]">
                      Logged by coach
                    </Badge>
                  )}
                </TableCell>
                <TableCell>{entry.duration_minutes}m</TableCell>
                <TableCell>{entry.rpe}</TableCell>
                <TableCell className="font-medium">{entry.session_load}</TableCell>
                <TableCell>
                  <form action={removeLoadEntry.bind(null, entry.id)}>
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
