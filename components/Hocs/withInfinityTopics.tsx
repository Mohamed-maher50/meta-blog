"use client";

import WithInfinityScroll from "@/components/Hocs/WithInfinityScroll";
import { InfiniteScrollProps } from "@/components/ui/InfiniteScroll";

import { Loader2 } from "lucide-react";
import { memo } from "react";
import { Button } from "../ui/button";
import { Topics } from "@prisma/client";
import { TopicRectangleCard } from "../topics/TopicRectangleCard";
import { followedTopics } from "@/lib/Topics";
import { GridTopicSkeleton } from "../topics/GridTopicSkeleton";
interface InfinityTopicsSectionProps extends InfiniteScrollProps {
  data: Topics[];
  userId: string;
}
const WithInfinityTopic = ({
  hasMore,
  data,
  next,
  isLoading,
}: InfinityTopicsSectionProps) => {
  if (isLoading) return <GridTopicSkeleton />;
  return (
    <>
      {data?.map((topic) => {
        return <TopicRectangleCard topic={topic} key={topic.id} />;
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
  memo(WithInfinityTopic),
  async ({ page, query, userId }) => {
    return await followedTopics({
      query: `${query}&page=${page}&limit=10`,
      userId,
    });
  }
);
