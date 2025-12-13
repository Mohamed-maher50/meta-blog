"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import React, { useMemo } from "react";

const Loading = () => {
  const SkeletonsListItems = useMemo(() => {
    return Array.from({ length: 2 }).map((_, i) => (
      <div key={i} className="flex items-start space-x-4">
        {/* صورة أو أيقونة */}
        <Skeleton className="h-12 w-12 rounded-md" />

        <div className="flex-1 space-y-2">
          {/* عنوان */}
          <Skeleton className="h-4 w-3/4" />
          {/* وصف */}
          <Skeleton className="h-3 w-5/6" />
        </div>
      </div>
    ));
  }, []);
  return (
    <div className="mt-16">
      <Skeleton className={cn("min-w-48 flex w-fit h-9")} />

      <Skeleton className={cn(" block h-10 my-6")} />

      <div className="flex  gap-3 items-center">
        <Skeleton className=" relative flex size-8 shrink-0 overflow-hidden rounded-full" />
        <div className="flex my-6 items-center">
          <Skeleton className="h-5 w-36" />
        </div>
      </div>
      <Skeleton className={cn(" block  w-[73.5rem] rounded-lg h-[29rem]")} />
      <div className="relative rounded-lg overflow-hidden isolate">
        <div className="absolute inset-0 bg-black/40"></div>
      </div>
      <div className="space-y-6 max-w-3xl mt-8 px-4">
        {/* Title */}
        <Skeleton className="h-10 w-2/3 rounded-md" />
        {SkeletonsListItems}
      </div>
    </div>
  );
};

export default Loading;
