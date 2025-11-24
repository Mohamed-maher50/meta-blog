"use client";
import RichBlogCard from "@/components/blogs/RichBlogCard";
import { DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import InfiniteScroll from "@/components/ui/InfiniteScroll";
import { GetBlogs } from "@/lib/blogs";
import { BlogCardProps } from "@/types";
import { Loader2 } from "lucide-react";
import React, { useState } from "react";

function BlogsRelatedWithTopicSection({ topicId }: { topicId?: string }) {
  const [page, setPage] = React.useState(1);
  const [loading, setLoading] = React.useState(false);
  const [hasMore, setHasMore] = React.useState(true);
  const [blogs, setBlogs] = useState<BlogCardProps[] | null>(null);

  const next = async () => {
    setLoading(true);

    try {
      const { data, success } = await GetBlogs<BlogCardProps>(
        `limit=10&page=${page}&omit[]=content&topicId=${topicId}`
      );
      if (!success) throw new Error("can't fetch blogs");
      setBlogs((prev) => {
        if (prev == null) return data;
        return [...prev, ...data];
      });
      setPage((prev) => prev + 1);

      if (data.length < 10) setHasMore(false);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="grow grid h-fit   max-sm:grid-cols-1 grid-cols-2 gap-10">
        {blogs?.map((b) => {
          return <RichBlogCard key={b.id} {...b} />;
        })}
      </div>

      <DropdownMenuSeparator />
      <InfiniteScroll
        hasMore={hasMore}
        isLoading={loading}
        next={next}
        threshold={1}
      >
        {hasMore && (
          <Loader2 className="my-4 text-muted-foreground mx-auto h-8 w-8 animate-spin" />
        )}
      </InfiniteScroll>
    </div>
  );
}

export default BlogsRelatedWithTopicSection;
