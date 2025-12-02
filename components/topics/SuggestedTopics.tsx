import { getTopics } from "@/lib/Topics";
import Link from "next/link";
import React from "react";
import { Badge } from "../ui/badge";
import { EmptyStateAlert } from "../EmptyStateAlert";

const SuggestedTopics = async ({
  query,
  fetchQuery,
  limit = 10,
}: {
  query?: string;
  fetchQuery?: string;
  limit?: number;
}) => {
  const { data, pagination } = await getTopics(fetchQuery);
  if (pagination.totalItems < 1)
    return <EmptyStateAlert searchQuery={query} type="topics" />;
  return (
    <div className="flex py-2  gap-1 flex-wrap">
      {data.map((t) => {
        return (
          <Link key={t.id} href={`/topics/${t.id}`}>
            <Badge
              key={t.id}
              className="px-4 rounded-full dark:text-secondary-50 text-secondary-foreground-800  text-sm font-work-sans cursor-pointer  py-1.5"
              variant={"outline"}
              role="button"
            >
              {t.label}
            </Badge>
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

export default SuggestedTopics;
