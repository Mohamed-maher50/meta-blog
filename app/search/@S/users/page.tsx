import SuggestedBlogs from "@/components/blogs/SuggestedBlogs";
import SuggestedTopics from "@/components/topics/SuggestedTopics";
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
        Topics matching {q}
      </h1>
      <SuggestedTopics query={q} fetchQuery={`q=${q}&limit=10`} limit={10} />

      <h1 className="text-secondary-900 font-work-sans font-semibold text-lg">
        Posts matching {q}
      </h1>
      <SuggestedBlogs query={q} fetchQuery={`q=${q}&limit=10`} />
    </div>
  );
};

export default page;
