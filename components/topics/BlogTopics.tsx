import { baseUrl } from "@/lib/baseUrl";
import { ResponseSuccess } from "@/types";
import { Topics } from "@prisma/client";
import SectionLabel from "../miscellaneous/SectionLabel";
import { TopicRectangleCardSkeleton } from "./TopicRectangleCardSkeleton";
import { TopicRectangleCard } from "./TopicRectangleCard";
import { cn } from "@/lib/utils";
import { Skeleton } from "../ui/skeleton";
export const BlogTopicsSkeletons = () => {
  return (
    <div className=" items-center  flex-wrap">
      <Skeleton className="h-9 w-36  mb-2 block" />
      <div className="flex gap-2">
        <TopicRectangleCardSkeleton className={cn(`h-9 w-24`)} />
        <TopicRectangleCardSkeleton className={cn(`h-9 w-16`)} />
        <TopicRectangleCardSkeleton className={cn(`h-9 w-20`)} />
      </div>
    </div>
  );
};
async function BlogTopics({ blogId }: { blogId: string }) {
  const res = await fetch(`${baseUrl}/api/blogs/${blogId}/topics`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error(`can't get blog:${blogId}  topics `);

  const blogTopics: ResponseSuccess<
    {
      id: string;
      topic: Topics;
    }[]
  > = await res.json();
  return (
    <div className=" items-center  flex-wrap">
      <SectionLabel> Blog Topics</SectionLabel>
      <div className="flex flex-wrap gap-2">
        {blogTopics.data?.slice(0, 5)?.map((t) => {
          return <TopicRectangleCard topic={t.topic} key={t.id} />;
        })}
      </div>
    </div>
  );
}

export default BlogTopics;
