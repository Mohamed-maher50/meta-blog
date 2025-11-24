"use client";
import { ResponseSuccess } from "@/types";
import React, { ComponentType, useCallback, useState } from "react";
import { InfiniteScrollProps } from "../ui/InfiniteScroll";
type fetcherProps<T> = Omit<T, "data" | keyof InfiniteScrollProps> & {
  page: number;
  query?: string;
};
const WithInfinityScroll = <T extends object, P>(
  Component: ComponentType<T>,
  fetcher: ({ page, query }: fetcherProps<T>) => Promise<ResponseSuccess<P[]>>
) => {
  return function WrappedComponent(
    props: Omit<T, keyof InfiniteScrollProps | "data"> & {
      query?: string;
    }
  ) {
    const [page, setPage] = useState(2);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [users, setUsers] = useState<P[] | null>(null);
    const next = useCallback(async () => {
      if (loading || !hasMore) return;
      setLoading(true);
      try {
        const data = await fetcher({
          ...(props as Omit<T, keyof InfiniteScrollProps | "data">),
          page,
          query: props.query,
        });
        if (!data) throw new Error("can't fetch users");
        setUsers((prev) => {
          if (prev == null) return data.data;
          return [...prev, ...data.data];
        });
        setPage((prev) => prev + 1);
        if (!data.pagination.hasNextPage) setHasMore(false);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
      } finally {
        setLoading(false);
      }
    }, [hasMore, loading, page, props.query]);
    return (
      <Component
        hasMore={hasMore}
        isLoading={loading}
        next={next}
        threshold={1}
        data={users}
        {...(props as T)}
      />
    );
  };
};

export default WithInfinityScroll;
