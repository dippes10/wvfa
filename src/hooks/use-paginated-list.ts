"use client";

import { useState, useTransition } from "react";

export function usePaginatedList<T>(
  initialItems: T[],
  initialHasMore: boolean,
  fetchMore: (offset: number) => Promise<{ items: T[]; hasMore: boolean }>,
) {
  const [items, setItems] = useState(initialItems);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [isPending, startTransition] = useTransition();

  function loadMore() {
    startTransition(async () => {
      const page = await fetchMore(items.length);
      setItems((prev) => [...prev, ...page.items]);
      setHasMore(page.hasMore);
    });
  }

  function reset(nextItems: T[], nextHasMore: boolean) {
    setItems(nextItems);
    setHasMore(nextHasMore);
  }

  return { items, hasMore, isPending, loadMore, reset };
}
