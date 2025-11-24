import BlogCardHorizontal from "@/components/blogs/RichBlogCardHorizontal";
import { EmptyStateAlert } from "@/components/EmptyStateAlert";
import { GetBlogs } from "@/lib/blogs";
import { BlogCardProps, ResponseSuccess } from "@/types";
import React from "react";
const page = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) => {
  const { q } = await searchParams;

  const initialBlogs: ResponseSuccess<BlogCardProps[]> = await GetBlogs(
    `page=1&limit=10&q=${q}&omit[]=content&omit[]=authorId`
  );
  if (!initialBlogs.pagination.totalItems)
    return <EmptyStateAlert type="blogs" searchQuery={q} />;
  return (
    <div className=" gap-2 flex flex-col ">
      {initialBlogs.data.map((b) => {
        return <BlogCardHorizontal {...b} key={b.id} />;
      })}
      {/* <BlogsWithInfinityScroll  /> */}
    </div>
  );
};

export default page;
