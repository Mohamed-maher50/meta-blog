import { EmptyStateAlert } from "@/components/EmptyStateAlert";
import { Badge } from "@/components/ui/badge";
import { ResponseSuccess } from "@/types";
import { Topics } from "@prisma/client";
import Link from "next/link";
import InfinityTopicsSection from "./InfinityTopicsSection";
import { baseUrl } from "@/lib/baseUrl";

const getTopics = async (
  query: string,
  init?: RequestInit
): Promise<ResponseSuccess<Topics[]>> => {
  const res = await fetch(`${baseUrl}/api/topics?${query}`, init);
  if (!res.ok) throw new Error(`can't fetch topics`);
  return await res.json();
};
const page = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) => {
  const { q } = await searchParams;
  const initialTopics = await getTopics(`page=1&limit=50&q=${q}`);
  if (!initialTopics.pagination.totalItems)
    return <EmptyStateAlert type="topics" searchQuery={q} />;

  return (
    <div className="flex flex-col justify-center">
      <div className="flex gap-2  flex-wrap">
        {initialTopics.data.map((topic) => {
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
      </div>
      <div className="flex gap-2  flex-wrap">
        <InfinityTopicsSection query={q} />
      </div>
    </div>
  );
};

export default page;
