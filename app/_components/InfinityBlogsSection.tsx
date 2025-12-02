"use client";

import RichBlogCard from "@/components/blogs/RichBlogCard";
import WithInfinityScroll from "@/components/Hocs/WithInfinityScroll";
import { Button } from "@/components/ui/button";
import { InfiniteScrollProps } from "@/components/ui/InfiniteScroll";
import { GetRecommendedBlogs } from "@/lib/blogs";
import { BlogCardProps } from "@/types";

import { Loader2 } from "lucide-react";
import { FC, memo } from "react";
interface InfinityTopicsSectionProps extends InfiniteScrollProps {
  data: BlogCardProps[];
}
const InfinityBlogsCardsSection: FC<InfinityTopicsSectionProps> = ({
  hasMore,
  data,
  next,
  isLoading,
}) => {
  console.log(data);
  return (
    <>
      {data?.map((blog) => {
        return <RichBlogCard {...blog} key={blog.id} />;
      })}
      <div className="flex w-full grow col-span-full justify-center">
        <span hidden={!isLoading} className="block w-fit mx-auto">
          <Loader2 className="animate-spin" />
        </span>
        <Button
          className="capitalize"
          onClick={next}
          variant={"ghost"}
          hidden={!hasMore || isLoading}
        >
          show more
        </Button>
      </div>
    </>
  );
};
export default WithInfinityScroll(
  memo(InfinityBlogsCardsSection),
  async ({ page, query }) => {
    return await GetRecommendedBlogs(`${query}page=${page}&limit=10`);
  }
);
