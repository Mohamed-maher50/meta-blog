"use client";
import TopicBadgeSkeleton from "@/components/topics/TopicBadgeSkeleton";

function Loading() {
  return (
    <div className="flex flex-wrap gap-2 w-full">
      {Array.from({ length: 10 }).map((e, idx) => {
        return <TopicBadgeSkeleton key={idx} />;
      })}
    </div>
  );
}

export default Loading;
