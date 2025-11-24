"use client";

import WithInfinityScroll from "@/components/Hocs/WithInfinityScroll";
import { InfiniteScrollProps } from "@/components/ui/InfiniteScroll";
import { BlogWithRelations } from "@/types";

import { Loader2 } from "lucide-react";
import { memo } from "react";
import { ProfileBlogCard } from "../blogs/ProfileBlogCard";
import { GetBlogs } from "@/lib/blogs";
import { Button } from "../ui/button";
import { BlogOperationHeader } from "../blogs/BlogOperationHeader";
interface InfinityTopicsSectionProps extends InfiniteScrollProps {
  data: BlogWithRelations[];
  withHeader?: boolean;
}
const ProfileInfinityBlogsSection = ({
  hasMore,
  data,
  next,
  isLoading,
  withHeader = false,
}: InfinityTopicsSectionProps) => {
  return (
    <>
      {data?.map((topic) => {
        return (
          <div key={topic.id} className="relative">
            {withHeader && <BlogOperationHeader {...topic} />}
            <ProfileBlogCard post={topic} key={topic.id} />
          </div>
        );
      })}
      <div className="flex w-full grow col-span-full justify-center">
        <p className="text-muted-foreground capitalize" hidden={hasMore}>
          No more
        </p>
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
  memo(ProfileInfinityBlogsSection),
  async ({ page, query }) => {
    return await GetBlogs(`?${query}&page=${page}&limit=10`);
  }
);
