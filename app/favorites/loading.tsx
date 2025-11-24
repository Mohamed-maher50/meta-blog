"use client";
import { Separator } from "@/components/ui/separator";
import React from "react";
import ResultCardSkeletons from "../blogs/_components/ResultCardSkeletons";
import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <div className="py-12">
      <div className="flex justify-between items-center">
        <div className="flex gap-1">
          <span className="relative flex justify-center items-center gap-2 z-20">
            <Skeleton className="w-8 h-8 rounded-full" />
            <Skeleton className="w-32 h-8 " />
          </span>
        </div>
        <Skeleton className="w-36 h-8 " />
      </div>
      <Separator className="my-4" />
      <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3">
        <ResultCardSkeletons />
      </div>
    </div>
  );
};

export default Loading;
