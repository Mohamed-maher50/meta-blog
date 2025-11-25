import Link from "next/link";
import React from "react";
import { GetUsers } from "@/lib/Users";
import { headers } from "next/headers";
import { UserInfo } from "@/types";
import { UserSuggestionCard } from "./userSuggestionCard";

const SuggestedPeople = async ({
  query,
  fetchQuery,
  limit = 10,
}: {
  query?: string;
  fetchQuery?: string;
  limit?: number;
}) => {
  const requestHeaders = await headers();
  new Headers(requestHeaders);
  const getUserResponse = await GetUsers<
    (UserInfo & { isFollowing: boolean })[]
  >(fetchQuery as string, { headers: requestHeaders });
  return (
    <div className="flex py-2  gap-1 flex-wrap">
      {getUserResponse.data.map((t) => {
        return (
          <Link className="w-full" key={t.id} href={`/author/${t.id}`}>
            <UserSuggestionCard user={t} key={t.id} />
          </Link>
        );
      })}
      <Link
        hidden={getUserResponse.pagination.totalItems <= limit}
        href={`/search/topics?q=${query}`}
        className="flex-1 basis-full flex w-full  capitalize text-sm font-work-sans hover:underline text-secondary-foreground grow"
      >
        see all
      </Link>
    </div>
  );
};

export default SuggestedPeople;
