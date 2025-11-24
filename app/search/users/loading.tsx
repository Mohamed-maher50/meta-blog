"use client";
import UserCardSkeleton from "@/components/users/UserCardSkeleton";
import React from "react";

function Loading() {
  return (
    <div className="grid grid-cols-1 gap-2">
      {Array.from({ length: 10 }).map((e, idx) => {
        return <UserCardSkeleton key={idx} />;
      })}
    </div>
  );
}

export default Loading;
