"use client";
import SkeletonCard from "@/components/SkeletonCard";
import React, { useMemo } from "react";

const ResultCardSkeletons = () => {
  const result = useMemo(() => {
    return Array.from({ length: 5 }, (v, i) => {
      return <SkeletonCard key={i} />;
    });
  }, []);
  return result;
};

export default ResultCardSkeletons;
