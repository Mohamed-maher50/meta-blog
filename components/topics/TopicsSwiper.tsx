"use client";
import { Topics } from "@/generated/prisma";
import { getTopics } from "@/lib/Topics";
import { ResponseSuccess } from "@/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import InfiniteScroll from "../ui/InfiniteScroll";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import Link from "next/link";

import { AlertTriangle } from "lucide-react";
import { Fragment } from "react/jsx-runtime";
import TopicCard, { SkeletonTopicCard } from "./TopicCard";

export function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/15 text-destructive border border-destructive/30">
      <AlertTriangle className="w-4 h-4" />
      <p className="text-sm">{message}</p>
    </div>
  );
}
const HomeTopicsSwiperLoadingMessage = () => {
  return (
    <div className="overflow-hidden flex flex-nowrap w-full gap-4">
      {Array.from({ length: 10 }, (idx, k) => k).map((key) => (
        <SkeletonTopicCard key={key} />
      ))}
    </div>
  );
};

interface HomeTopicsSwiperProps {
  query?: string;
  label: string;
  desc: string;
}
const TopicsSwiper = ({ query = "", label, desc }: HomeTopicsSwiperProps) => {
  const {
    data: topics,
    isFetchingNextPage,
    hasNextPage,
    isError,
    isSuccess,
    isLoading,
    fetchNextPage,
  } = useInfiniteQuery<ResponseSuccess<Topics[]>>({
    queryKey: [`topics_swiper_${query}`],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await getTopics(`page=${pageParam}&limit=10${query}`);
      return res;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (!lastPage.pagination.hasNextPage) return undefined;
      return lastPage.pagination.hasNextPage;
    },
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 15,
    gcTime: 1000 * 60 * 5,
  });
  return (
    <div className="py-4">
      <div className=" mb-6">
        <h2 className="text-xl sm:text-3xl font-bold my-4 capitalize font-work-sans leading-4 text-foreground  text-balance">
          {label}
        </h2>
        <p className="text-sm text-muted-foreground mt-1">{desc}</p>
      </div>
      {isLoading && <HomeTopicsSwiperLoadingMessage />}
      {isError && <ErrorMessage message="error during get topics" />}
      {!isLoading && !isError && isSuccess && (
        <Carousel
          className="w-full group px-4 sm:px-8"
          opts={{
            align: "start",
          }}
        >
          <CarouselContent className="-ml-4">
            {topics?.pages.map((p, idx) => {
              return (
                <Fragment key={idx}>
                  {p.data?.map((topic) => (
                    <CarouselItem key={topic.id} className="pl-4 basis-auto">
                      <Link href={`/topics/${topic.id}/`} key={topic.id}>
                        <TopicCard topic={topic} />
                      </Link>
                    </CarouselItem>
                  ))}
                </Fragment>
              );
            })}{" "}
            <CarouselItem key={"lastCard"} className="w-fit! max-w-fit!">
              <InfiniteScroll
                hasMore={hasNextPage}
                isLoading={isFetchingNextPage}
                next={fetchNextPage}
                threshold={1}
              >
                {hasNextPage && (
                  <div className="mr-10">
                    <SkeletonTopicCard />
                  </div>
                )}
              </InfiniteScroll>
            </CarouselItem>
          </CarouselContent>

          <CarouselPrevious className="absolute left-0 top-1/2 -translate-y-1/2 h-10 w-10 bg-primary hover:bg-primary/90 text-primary-foreground border-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100" />
          <CarouselNext className="absolute right-0 top-1/2 -translate-y-1/2 h-10 w-10 bg-primary hover:bg-primary/90 text-primary-foreground border-0 shadow-lg hover:opacity-100 transition-opacity duration-200 group-hover:opacity-100" />
        </Carousel>
      )}
    </div>
  );
};

export default TopicsSwiper;
