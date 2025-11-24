import Link from "next/link";
import React from "react";
import { GetBlogs } from "@/lib/blogs";
import { BlogCardCompact } from "./BlogCompactCard";
import { BlogCardProps } from "@/types";

const SuggestedBlogs = async ({
  query,
  fetchQuery,
  limit = 10,
}: {
  query?: string;
  fetchQuery?: string;
  limit?: number;
}) => {
  const { data, pagination } = await GetBlogs<BlogCardProps>(fetchQuery);
  return (
    <div className="flex py-2  gap-1 flex-wrap">
      {data.map((t) => {
        return (
          <Link key={t.id} className="w-full" href={`/blogs/${t.id}`}>
            <BlogCardCompact blog={t} />
          </Link>
        );
      })}
      <Link
        hidden={pagination.totalItems <= limit}
        href={`/search/topics?q=${query}`}
        className="flex-1 basis-full flex w-full  capitalize text-sm font-work-sans hover:underline text-secondary-foreground grow"
      >
        see all
      </Link>
    </div>
  );
};

export default SuggestedBlogs;
