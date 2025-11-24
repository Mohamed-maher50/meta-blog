import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { RiFireFill } from "@remixicon/react";

const DiscoverTopicsSkeleton = () => {
  return (
    <div className="space-y-6 sticky top-1 h-fit w-72 md:w-92">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RiFireFill className="w-5 h-5 text-primary animate-pulse" />
            <span className="bg-gradient-to-r from-muted-foreground/50 to-muted-foreground/20 bg-clip-text text-transparent">
              Loading Topics...
            </span>
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="p-3 rounded-lg bg-secondary/50 flex flex-col gap-2"
              >
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-3 w-1/3" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DiscoverTopicsSkeleton;
