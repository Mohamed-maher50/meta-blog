import RichBlogCard from "@/components/blogs/RichBlogCard";
import SectionLabel from "@/components/miscellaneous/SectionLabel";
import { BlogCardProps } from "@/types";
import React from "react";
async function DisplayHomeBlogs({
  blogs,
  label,
}: {
  blogs: BlogCardProps[];
  label?: string;
}) {
  return (
    <div>
      <SectionLabel className="max-sm:flex max-sm:flex-col max-sm:items-center max-sm:mx-auto max-sm:justify-center ">
        {label}
      </SectionLabel>
      <div className="grid gap-2 max-sm:place-items-center place-content-center my-2 grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {blogs.map((b) => {
          return <RichBlogCard {...b} key={b.id} />;
        })}
      </div>
    </div>
  );
}

export default DisplayHomeBlogs;
