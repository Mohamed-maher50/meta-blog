"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useMemo } from "react";

export default function TopicBadgeSkeleton({ count = 5 }: { count?: number }) {
  const random = useMemo(() => {
    return Math.floor(Math.random() * 7);
  }, []);
  return (
    <div className="flex flex-wrap gap-2">
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton
          key={i}
          suppressHydrationWarning
          className={cn(
            " rounded-full h-8",
            ["w-10 ", "w-20 ", "w-14", "w-32 ", "w-16", "w-24"][random]
          )}
        />
      ))}
    </div>
  );
}
