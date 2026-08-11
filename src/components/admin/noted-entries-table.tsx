"use client";

import Link from "next/link";
import { usePaginatedList } from "@/hooks/use-paginated-list";
import { loadMoreNotedEntriesAction } from "@/lib/actions/pagination-actions";
import { LoadMoreButton } from "@/components/admin/load-more-button";
import type { LoadEntry } from "@/lib/services/loadService";
import type { Profile } from "@/lib/services/userService";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function NotedEntriesTable({
  playersById,
  initialItems,
  initialHasMore,
}: {
  playersById: Record<string, Pick<Profile, "id" | "full_name" | "email">>;
  initialItems: LoadEntry[];
  initialHasMore: boolean;
}) {
  const { items, hasMore, isPending, loadMore } = usePaginatedList(
    initialItems,
    initialHasMore,
    loadMoreNotedEntriesAction,
  );

  if (items.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No notes attached to any session yet.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Player</TableHead>
              <TableHead>Session</TableHead>
              <TableHead>Note</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((entry) => {
              const player = playersById[entry.player_id];
              return (
                <TableRow key={entry.id}>
                  <TableCell>
                    <Link
                      href={`/admin/players/${entry.player_id}`}
                      className="font-medium hover:underline"
                    >
                      {player?.full_name ?? player?.email ?? "Unknown player"}
                    </Link>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {entry.activity_date} · {entry.description}
                  </TableCell>
                  <TableCell className="max-w-sm text-muted-foreground">{entry.notes}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      {hasMore && <LoadMoreButton onClick={loadMore} loading={isPending} />}
    </div>
  );
}
