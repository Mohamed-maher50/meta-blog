"use client";
import HorizontalCardSkeleton from "@/components/blogs/HorizontalCardSkeleton";
import React from "react";

const Loading = () => {
  return (
    <div>
      {Array.from({ length: 10 }).map((e, idx) => {
        return <HorizontalCardSkeleton key={idx} />;
      })}
    </div>
  );
};

export default Loading;
