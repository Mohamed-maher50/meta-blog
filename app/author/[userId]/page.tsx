import { Suspense } from "react";
import { ProfileHeader } from "@/components/users/profile-header";
import { BlogCardProps, UserInfo } from "@/types";
import TopicsFetcher from "@/app/topics/TopicsFetcher";
import { notFound } from "next/navigation";
import DisplayChunk from "@/components/utils/DisplayChunk";
import { GetBlogs } from "@/lib/blogs";
import { FileText, Tags } from "lucide-react";
import { GetUserById } from "@/lib/Users";
import ProfileInfinityBlogsSection from "@/components/Hocs/ProfileInfinityBlogsSection";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import WithInfinityTopics from "@/components/Hocs/withInfinityTopics";
import { GridTopicSkeleton } from "@/components/topics/GridTopicSkeleton";
import { GridBlogSkeletons } from "@/components/blogs/GridBlogsSkeletons";
import { RiBookShelfLine } from "@remixicon/react";
import RichBlogCard from "@/components/blogs/RichBlogCard";
import { headers } from "next/headers";
import { auth } from "@/auth";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ userId?: string }>;
}) {
  const { userId } = await params;
  const session = await auth();
  if (!userId) notFound();
  const user = await GetUserById<UserInfo & { isFollowing: boolean }>(
    userId,
    ``,
    { cache: "no-store" }
  );
  if (!user) notFound();

  const isOwnProfile = session?.user.userId === user.id;
  return (
    <div className="max-w-5xl  mx-auto space-y-12">
      <ProfileHeader user={user} isOwnProfile={isOwnProfile} />

      {/* Blog Posts Section */}
      <section className="space-y-6">
        <div className="flex justify-between">
          <div>
            <h2 className="text-3xl flex gap-2 items-center font-bold mb-2">
              <RiBookShelfLine className="fill-primary" />
              Blogs
            </h2>
            <p className="text-muted-foreground">
              Articles and thoughts on web development
            </p>
          </div>
          {isOwnProfile && (
            <Button
              className="self-end "
              aria-label="Start your next masterpiece"
            >
              <Link href={`/blogs/new`} className="capitalize">
                ✨<span className="max-sm:hidden">Write a</span> new story
              </Link>
            </Button>
          )}
        </div>
        <div className="space-y-4">
          <Suspense fallback={<GridBlogSkeletons />}>
            <DisplayChunk
              fetcher={async () => {
                const requestHeaders = await headers();
                const { data } = await GetBlogs<BlogCardProps>(
                  `authorId=${userId}`,
                  {
                    headers: requestHeaders,
                  }
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
                      No articles have been published by this user yet. Once
                      they start sharing their insights, tutorials, or stories,
                      you’ll find them listed here. Check back soon to discover
                      new posts, or explore other authors and topics in the
                      meantime!
                    </p>
                  </div>
                );
              }}
              render={(d) => {
                return (
                  <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2">
                    {d.map((e) => {
                      return (
                        <RichBlogCard {...e} key={e.id} Editable Deletable />
                      );
                    })}
                    <ProfileInfinityBlogsSection
                      query={`userId=${user.id}`}
                      withHeader={true}
                    />
                  </div>
                );
              }}
            />
          </Suspense>
        </div>
      </section>

      {/* Topics Section */}
      <section className="space-y-6">
        <div>
          <h2 className="text-3xl flex gap-2 items-center font-bold mb-2">
            <Tags className="fill-primary" />
            Topics
          </h2>
          <p className="text-muted-foreground">
            Areas of interest and expertise
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Suspense fallback={<GridTopicSkeleton />}>
            <TopicsFetcher
              userId={userId}
              query={"omit[]=userId&omit[]=user&omit[]=topicId&page=1&limit=10"}
            />
          </Suspense>
          <WithInfinityTopics query={`userId=${userId}`} userId={userId} />
        </div>
      </section>
    </div>
  );
}
