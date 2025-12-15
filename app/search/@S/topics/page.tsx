import SuggestedBlogs from "@/components/blogs/SuggestedBlogs";
import SearchQueryLabel from "@/components/SearchQueryLabel";
import SuggestedPeople from "@/components/users/SuggestedPeople";
import React from "react";

const page = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) => {
  const { q } = await searchParams;

  return (
    <div className="flex flex-col gap-2 flex-wrap">
      <SearchQueryLabel label=" Posts matching" query={q || ""} />

      <SuggestedBlogs query={q} fetchQuery={`q=${q}&limit=10`} />

      <SearchQueryLabel label="People matching" query={q || ""} />
      <SuggestedPeople query={q} fetchQuery={`q=${q}&limit=10`} />
    </div>
  );
};

export default page;
