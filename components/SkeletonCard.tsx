import React from "react";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Skeleton } from "./ui/skeleton";

const SkeletonCard = () => {
  return (
    <Card className="">
      <CardHeader className="p-4">
        <Skeleton className="w-full   overflow-hidden mx-auto    h-64   rounded-sm" />
      </CardHeader>

      <CardContent>
        <Skeleton className="h-5 w-14" />
        <Skeleton className="h-16 w-full" />
      </CardContent>

      <CardFooter className="flex mt-auto text-secondary-foreground-400">
        <div className="flex gap-2  justify-center  items-center">
          <span className="relative flex justify-center items-center gap-2 z-20">
            <Skeleton className="w-8 h-8 rounded-full" />
            <Skeleton className="w-32 h-8 " />
          </span>
          <Skeleton className="w-32 h-8 " />
        </div>
      </CardFooter>
    </Card>
  );
};

export default SkeletonCard;
