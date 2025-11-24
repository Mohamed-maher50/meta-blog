"use client";

import WithInfinityScroll from "@/components/Hocs/WithInfinityScroll";
import { InfiniteScrollProps } from "@/components/ui/InfiniteScroll";
import { CompactFavorites } from "@/types";

import { Loader2 } from "lucide-react";
import { memo } from "react";
import { Button } from "../ui/button";
import { GET_USER_FAVORITES } from "@/lib/UserFavoritesBlogs";
import RichBlogCard from "../blogs/RichBlogCard";
interface InfinityTopicsSectionProps extends InfiniteScrollProps {
  data: CompactFavorites[];
  withHeader?: boolean;
}
const WithInfinityFavoritesCards = ({
  hasMore,
  data,
  next,
  isLoading,
}: InfinityTopicsSectionProps) => {
  return (
    <>
      {data?.map((topic) => {
        return <RichBlogCard {...topic.blog} isSaved={true} key={topic.id} />;
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
  memo(WithInfinityFavoritesCards),
  async ({ page, query }) => {
    return await GET_USER_FAVORITES<CompactFavorites[]>(
      `?${query}&page=${page}&limit=10`
    );
  }
);
