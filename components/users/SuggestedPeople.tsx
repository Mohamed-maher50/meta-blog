import Link from "next/link";
import { GetUsers } from "@/lib/Users";
import { headers as NextHeaders } from "next/headers";
import { UserInfo } from "@/types";
import { UserSuggestionCard } from "./userSuggestionCard";
import { EmptyStateAlert } from "../EmptyStateAlert";

const SuggestedPeople = async ({
  query,
  fetchQuery,
  limit = 10,
}: {
  query?: string;
  fetchQuery?: string;
  limit?: number;
}) => {
  const headers = new Headers(await NextHeaders());

  const getUserResponse = await GetUsers<
    (UserInfo & { isFollowing: boolean })[]
  >(fetchQuery as string, { headers });

  if (getUserResponse.pagination.totalItems < 1)
    return <EmptyStateAlert searchQuery={query} type="blogs" />;
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
