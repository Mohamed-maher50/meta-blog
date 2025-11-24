import { cn } from "@/lib/utils";
import { TopicRectangleCardSkeleton } from "./TopicRectangleCardSkeleton";

export const GridTopicSkeleton = () =>
  Array.from({ length: 20 }, (x, idx) => (
    <TopicRectangleCardSkeleton
      key={idx}
      className={cn("py-4", ["w-20", "w-32"][0])}
    />
  ));
