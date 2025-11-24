import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import React from "react";

const Loading = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-12">
      <div className="space-y-8">
        {/* Profile Info */}
        <div className="flex items-start justify-between">
          <div className="flex gap-6">
            <Skeleton className="h-24 w-24 rounded-full shadow" />

            <div className="space-y-2">
              <Skeleton className="h-10 w-32 lg:w-72" />
              <Skeleton className="h-10 w-20 hidden max-sm:block lg:w-72" />
              <Skeleton className="h-10 w-60" />
            </div>
          </div>
          <div>
            <Skeleton className="h-8 w-32" />
          </div>
        </div>
        <Skeleton className="h-14 max-sm:h-40 w-full" />

        {/* Contact & Social Media */}
        <div className="flex max-sm:flex-col flex-wrap gap-8">
          <div className="flex flex-col gap-1.5">
            <Skeleton className="w-16 h-5" />
            <Skeleton className="w-72 h-6" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Skeleton className="w-24 h-5" />
            <div className="flex gap-2">
              <Skeleton className={cn("w-9 h-9")} />
              <Skeleton className={cn("w-9 h-9")} />
              <Skeleton className={cn("w-9 h-9")} />
              <Skeleton className={cn("w-9 h-9")} />
            </div>
          </div>
        </div>
      </div>

      <section className="space-y-6">
        <div className="flex justify-between">
          <div className="flex flex-col gap-3">
            <Skeleton className="w-20 h-9" />
            <Skeleton className="w-72 h-6" />
          </div>
          <Skeleton className="self-end w-44 h-9" />
        </div>
      </section>

      {/* Topics Section */}
      <section className="space-y-6">
        <div className="flex flex-col gap-2">
          <Skeleton className="w-20 h-9" />
          <Skeleton className="w-72 h-6" />
        </div>
      </section>
    </div>
  );
};

export default Loading;
