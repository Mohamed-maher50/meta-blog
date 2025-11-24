import { cn } from "@/lib/utils";
import { badgeVariants } from "../ui/badge";
import { Skeleton } from "../ui/skeleton";
import { HTMLAttributes } from "react";

export function TopicRectangleCardSkeleton({
  className,
  ...attrs
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <Skeleton
      className={cn(
        badgeVariants({ variant: "outline" }),
        "px-4 py-2 text-sm border-accent/50 hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer",
        className
      )}
      {...attrs}
    />
  );
}
