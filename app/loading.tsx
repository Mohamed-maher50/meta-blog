import { HeroSectionSkeleton } from "@/components/HeroSections";
import React from "react";

const Loading = () => {
  return (
    <div className="min-h-dvh">
      <div className="flex flex-col">
        <HeroSectionSkeleton />
      </div>
    </div>
  );
};

export default Loading;
