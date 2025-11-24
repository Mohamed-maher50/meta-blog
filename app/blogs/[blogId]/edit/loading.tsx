"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import React, { useMemo } from "react";

const BlogPageLoading = () => {
  const SkeletonsListItems = useMemo(() => {
    return Array.from({ length: 5 }).map((_, i) => (
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
    <div className="mt-16 min-h-screen">
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

        {/* Paragraphs */}
        <div className="space-y-3">
          <Skeleton className="h-4 w-full rounded" />
          <Skeleton className="h-4 w-5/6 rounded" />
          <Skeleton className="h-4 w-2/3 rounded" />
        </div>
        <div className="space-y-3">
          <Skeleton className="h-4 w-full rounded" />
          <Skeleton className="h-4 w-5/6 rounded" />
          <Skeleton className="h-4 w-2/3 rounded" />
        </div>
        {/* Heading */}
        <Skeleton className="h-8 w-1/3 rounded-md mt-6" />

        {/* More paragraphs */}
        <div className="space-y-3">
          <Skeleton className="h-4 w-4/5 rounded" />
          <Skeleton className="h-4 w-3/4 rounded" />
          <Skeleton className="h-4 w-2/3 rounded" />
        </div>
        {SkeletonsListItems}
        {/* Image placeholder */}
        <Skeleton className="h-64 w-full rounded-xl mt-8" />

        {/* More paragraph blocks */}
        <div className="space-y-3 mt-6">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/6" />
        </div>
      </div>
      <div className="space-y-6 max-w-3xl mt-8 px-4">
        {/* Title */}
        <Skeleton className="h-10 w-2/3 rounded-md" />

        {/* Paragraphs */}
        <div className="space-y-3">
          <Skeleton className="h-4 w-full rounded" />
          <Skeleton className="h-4 w-5/6 rounded" />
          <Skeleton className="h-4 w-2/3 rounded" />
        </div>
        <div className="space-y-3">
          <Skeleton className="h-4 w-full rounded" />
          <Skeleton className="h-4 w-5/6 rounded" />
          <Skeleton className="h-4 w-2/3 rounded" />
        </div>
        {/* Heading */}
        <Skeleton className="h-8 w-1/3 rounded-md mt-6" />

        {/* More paragraphs */}
        <div className="space-y-3">
          <Skeleton className="h-4 w-4/5 rounded" />
          <Skeleton className="h-4 w-3/4 rounded" />
          <Skeleton className="h-4 w-2/3 rounded" />
        </div>

        {/* Image placeholder */}
        <Skeleton className="h-64 w-full rounded-xl mt-8" />

        {/* More paragraph blocks */}
        <div className="space-y-3 mt-6">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/6" />
        </div>
      </div>
    </div>
  );
};

export default BlogPageLoading;
