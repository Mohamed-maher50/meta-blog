import SuggestedBlogs from "@/components/blogs/SuggestedBlogs";
import SuggestedPeople from "@/components/users/SuggestedPeople";
import React from "react";

const page = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) => {
  const { q } = await searchParams;

  return (
    <div className="flex gap-2 flex-wrap">
      <h1 className="text-secondary-900 font-work-sans font-semibold text-lg">
        Posts matching {q}
      </h1>
      <SuggestedBlogs query={q} fetchQuery={`q=${q}&limit=10`} />
      <h1 className="text-secondary-900 font-work-sans font-semibold text-lg">
        People matching {q}
      </h1>
      <SuggestedPeople query={q} fetchQuery={`q=${q}&limit=10`} />
    </div>
  );
};

export default page;
