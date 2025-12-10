import { formatCompactNumber } from "@/lib/utils";
import { Topics } from "@prisma/client";
import { Skeleton } from "../ui/skeleton";

interface TopicCardProps {
  topic: Topics;
}

export default function TopicCard({ topic }: TopicCardProps) {
  const followers = formatCompactNumber(topic.numberOfFollowers);

  return (
    <div className="p-3 block w-full rounded-xl bg-secondary/50 hover:bg-secondary transition-colors cursor-pointer">
      <p className="font-semibold text-foreground">{topic.label}</p>
      <p className="text-sm text-secondary-foreground">{followers} followers</p>
    </div>
  );
}

export function SkeletonTopicCard() {
  return (
    <div className="p-4 w-full min-w-28 rounded-xl bg-secondary/40">
      <Skeleton className="h-4 w-full  mb-2" />
      <Skeleton className="h-3 w-w-full" />
    </div>
  );
}
