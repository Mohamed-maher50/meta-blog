"use client";
import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { Button } from "./ui/button";

const RestCategoryQueryValueButton = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  return (
    <Button
      size={"sm"}
      variant={"link"}
      className={cn(
        "font-work-sans dark:text-secondary-foreground-300 font-medium underline  "
      )}
      onClick={() => {
        const url = new URLSearchParams(searchParams);
        url.delete("categoryId");
        router.push(`?${url.toString()}`);
      }}
    >
      view all
    </Button>
  );
};

export default RestCategoryQueryValueButton;
