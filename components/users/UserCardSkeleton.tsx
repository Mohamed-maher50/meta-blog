"use client";

import { Skeleton } from "@/components/ui/skeleton";

interface UserCardSkeletonProps {
  variant?: "vertical" | "horizontal";
}

export default function UserCardSkeleton({
  variant = "horizontal",
}: UserCardSkeletonProps) {
  const isVertical = variant === "vertical";

  return (
    <div
      className={`
        overflow-hidden rounded-xl border border-border bg-card p-6
        shadow-sm transition-all duration-300
        ${
          isVertical
            ? "flex flex-col items-center text-center"
            : "flex flex-col md:flex-row md:items-start md:gap-6"
        }
      `}
    >
      {/* Avatar */}
      <div className={`flex-shrink-0 ${isVertical ? "mb-4" : "md:mb-0"}`}>
        <div className="h-24 w-24 rounded-full overflow-hidden ring-2 ring-border">
          <Skeleton className="h-full w-full rounded-full" />
        </div>
      </div>

      {/* Info */}
      <div className={`flex-1 space-y-3 ${isVertical ? "w-full" : ""}`}>
        {/* Name + Job */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <Skeleton className="h-6 w-40 mb-2" />
            <Skeleton className="h-4 w-28" />
          </div>

          {/* Placeholder for follow button */}
          <Skeleton className="h-8 w-20 rounded-md" />
        </div>

        {/* Bio */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-1/2" />
        </div>

        {/* Contact Info */}
        <div className="flex flex-wrap gap-4 mt-3">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-28" />
        </div>

        {/* Social Media */}
        <div className="flex gap-2 pt-2">
          <Skeleton className="h-8 w-20 rounded-md" />
          <Skeleton className="h-8 w-20 rounded-md" />
          <Skeleton className="h-8 w-20 rounded-md" />
        </div>
      </div>
    </div>
  );
}
