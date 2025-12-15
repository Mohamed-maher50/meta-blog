import SearchQueryLabel from "@/components/SearchQueryLabel";
import SuggestedTopics from "@/components/topics/SuggestedTopics";
import { Badge } from "@/components/ui/badge";
import SuggestedPeople from "@/components/users/SuggestedPeople";

import React from "react";

const page = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) => {
  const { q } = await searchParams;

  return (
    <div className="flex gap-2 flex-col flex-wrap">
      <SearchQueryLabel label="Topics matching" query={q || ""} />
      <SuggestedTopics query={q} fetchQuery={`q=${q}&limit=10`} limit={10} />

      <SearchQueryLabel label="People matching" query={q || ""} />
      <SuggestedPeople query={q} limit={3} fetchQuery={`q=${q}&limit=10`} />
    </div>
  );
};

export default page;
