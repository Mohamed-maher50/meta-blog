import TopicFollowButton from "@/components/topics/TopicFollowButton";
import { getTopicById } from "@/lib/Topics";
import React, { Suspense } from "react";

import { FileText } from "lucide-react";
import { GetBlogs } from "@/lib/blogs";
import { BlogCardProps } from "@/types";
import DisplayChunk from "@/components/utils/DisplayChunk";
import { GridBlogSkeletons } from "@/components/blogs/GridBlogsSkeletons";
import RichBlogCard from "@/components/blogs/RichBlogCard";
import WithAuth from "@/components/auth/WithAuth";
import SectionLabel from "@/components/miscellaneous/SectionLabel";
import { auth } from "@/auth";
import { prisma } from "@/prisma";

const page = async ({ params }: { params: Promise<{ topicId: string }> }) => {
  const param = await params;
  const response = await getTopicById(`${param.topicId}`);
  const s = await auth();
  if (!response.success) throw new Error("can't get topics");
  const formatCount = (count: number): string => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };
  const isFollowing = await prisma.followTopic.findFirst({
    where: {
      topicId: param.topicId,
      userId: s?.user.userId,
    },
  });
  const isFollowed = isFollowing ? true : false;
  return (
    <div>
      <div className="py-8 capitalize  mx-auto w-fit text-center ">
        <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-3 text-balance">
          {response.data?.label}
        </h1>
        <div className="flex text-center mx-auto justify-center font-work-sans border-border border-b-2 mb-4 pb-4 items-center gap-2 text-sm text-muted-foreground">
          <span>Topic</span>
          <span>·</span>
          <span>{formatCount(response.data._count.followers)} followers</span>
          <span>·</span>
          <span>{formatCount(response.data._count.BlogTopics)} stories</span>
        </div>
        <WithAuth>
          <TopicFollowButton isFollowed={isFollowed} params={params} />
        </WithAuth>
      </div>

      <Suspense fallback={<GridBlogSkeletons />}>
        <DisplayChunk
          fetcher={async () => {
            const { data } = await GetBlogs<BlogCardProps>(
              `topicId=${param.topicId}`
            );
            return data;
          }}
          errorMessage={() => {
            return (
              <div className="flex  flex-col  items-center justify-center py-12 px-6 text-center">
                <div className="mb-4  rounded-sm bg-secondary p-4">
                  <FileText className="h-8 w-8 " />
                </div>

                <p className="text-secondary-foreground-500 max-w-md">
                  No articles have been published by this user yet. Once they
                  start sharing their insights, tutorials, or stories, you’ll
                  find them listed here. Check back soon to discover new posts,
                  or explore other authors and topics in the meantime!
                </p>
              </div>
            );
          }}
          render={(d) => {
            return (
              <div
                hidden={!d.length}
                className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 auto-rows-fr"
              >
                <h1 className="text-3xl leading-12 font-bold font-work-sans">
                  ✨Recommended Stories
                </h1>
                {d.map((e) => {
                  return <RichBlogCard {...e} key={e.id} />;
                })}
              </div>
            );
          }}
        />
      </Suspense>

      <Suspense fallback={<GridBlogSkeletons />}>
        <DisplayChunk
          fetcher={async () => {
            const { data } = await GetBlogs<BlogCardProps>(
              `topicId=${param.topicId}&orderBy[]=createAt`
            );
            return data;
          }}
          errorMessage={() => {
            return (
              <div className="flex  flex-col  items-center justify-center py-12 px-6 text-center">
                <div className="mb-4  rounded-sm bg-secondary p-4">
                  <FileText className="h-8 w-8 " />
                </div>

                <p className="text-secondary-foreground-500 max-w-md">
                  No articles have been published by this user yet. Once they
                  start sharing their insights, tutorials, or stories, you’ll
                  find them listed here. Check back soon to discover new posts,
                  or explore other authors and topics in the meantime!
                </p>
              </div>
            );
          }}
          render={(d) => {
            return (
              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 auto-rows-fr">
                <SectionLabel hidden={!d.length}>
                  📰 Latest Stories
                </SectionLabel>

                {d.map((e) => {
                  return <RichBlogCard {...e} key={e.id} />;
                })}
              </div>
            );
          }}
        />
      </Suspense>
      {/* <div>
        <BlogsRelatedWithTopicSection topicId={response.data.id} />
      </div> */}
    </div>
  );
};

export default page;
