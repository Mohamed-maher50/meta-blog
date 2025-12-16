import SearchQueryLabel from "@/components/SearchQueryLabel";
import SuggestedTopics from "@/components/topics/SuggestedTopics";
import { Badge } from "@/components/ui/badge";
import SuggestedPeople from "@/components/users/SuggestedPeople";

import React from "react";
const defaultQuery = {
  limit: "10",
};
const page = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) => {
  const searchParam = await searchParams;
  const search = new URLSearchParams({
    ...searchParam,
    ...defaultQuery,
  } as Record<string, string>);
  if (!search.has("q")) search.delete("q");
  const queryString = search.toString();

  return (
    <div className="flex gap-2 flex-col flex-wrap">
      <SearchQueryLabel label="Topics matching" query={search.get("q") || ""} />
      <SuggestedTopics
        query={search.get("q") || ""}
        fetchQuery={queryString}
        limit={10}
      />

      <SearchQueryLabel label="People matching" query={search.get("q") || ""} />
      <SuggestedPeople
        query={search.get("q") || ""}
        limit={3}
        fetchQuery={queryString}
      />
    </div>
  );
};

export default page;
