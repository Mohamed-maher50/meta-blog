import SuggestedBlogs from "@/components/blogs/SuggestedBlogs";
import SearchQueryLabel from "@/components/SearchQueryLabel";
import SuggestedTopics from "@/components/topics/SuggestedTopics";
import { Badge } from "@/components/ui/badge";
import React from "react";

const page = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) => {
  const { q } = await searchParams;
  return (
    <div className="flex flex-col gap-2 flex-wrap">
      <div className="mb-6">
        <SearchQueryLabel label="Topics matching" query={q || ""} />
      </div>
      <SuggestedTopics query={q} fetchQuery={`q=${q}&limit=10`} limit={10} />
      <SearchQueryLabel label="Posts matching" query={q || ""} />

      <SuggestedBlogs query={q} fetchQuery={`q=${q}&limit=10`} />
    </div>
  );
};

export default page;
