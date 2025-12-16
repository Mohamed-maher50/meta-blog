"use client";

import WithInfinityScroll from "@/components/Hocs/WithInfinityScroll";
import { Badge } from "@/components/ui/badge";
import InfiniteScroll, {
  InfiniteScrollProps,
} from "@/components/ui/InfiniteScroll";
import { getTopics } from "@/lib/Topics";

import { Topics } from "@prisma/client";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { FC, memo } from "react";
interface InfinityTopicsSectionProps extends InfiniteScrollProps {
  data: Topics[];
}
const InfinityTopicsSection: FC<InfinityTopicsSectionProps> = ({
  hasMore,
  data,
  next,
  isLoading,
}) => {
  return (
    <>
      {data?.map((topic) => {
        return (
          <Link key={topic.id} href={`/topics/${topic.id}`}>
            <Badge
              key={topic.id}
              className="px-4 rounded-full text-sm font-work-sans cursor-pointer  py-2"
              variant={"outline"}
              role="button"
            >
              {topic.label}
            </Badge>
          </Link>
        );
      })}
      <InfiniteScroll
        hasMore={hasMore}
        isLoading={isLoading}
        next={next}
        threshold={1}
      >
        {hasMore && (
          <Loader2 className="my-4 text-muted-foreground mx-auto h-8 w-8 animate-spin" />
        )}
      </InfiniteScroll>
    </>
  );
};
export default WithInfinityScroll(
  memo(InfinityTopicsSection),
  async ({ page, query }) => {
    return await getTopics(`q=${query}&page=${page}&limit=10`);
  }
);
