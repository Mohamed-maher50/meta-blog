"use client";

import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface BlogCardSkeletonProps {
  variant?: "default" | "compact";
}

export default function HorizontalCardSkeleton({
  variant = "default",
}: BlogCardSkeletonProps) {
  return (
    <Card
      className={cn(
        "group overflow-hidden rounded-none isolate relative border-none transition-all duration-300",
        "flex flex-col lg:flex-row md:h-48"
      )}
    >
      {/* Cover Image Placeholder */}
      <div className="relative w-full md:w-1/4 h-48 md:h-full flex-shrink-0">
        <Skeleton className="absolute inset-0 rounded-2xl" />
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 md:w-3/4">
        <CardHeader className="pb-3">
          {/* Topics */}
          <div className="flex flex-wrap gap-2 mb-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-5 w-16 rounded-full" />
            ))}
          </div>

          {/* Title */}
          <Skeleton className="h-6 w-3/4 mb-2" />
          <Skeleton className="h-6 w-1/2" />
        </CardHeader>

        <CardContent className="flex-1 mb-2 pt-0">
          {/* Metadata */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-24" />
          </div>
        </CardContent>

        <CardFooter className="pt-0">
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-4 w-32" />
          </div>
        </CardFooter>
      </div>
    </Card>
  );
}
