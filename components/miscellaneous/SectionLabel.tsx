import { cn } from "@/lib/utils";
import React, { HTMLAttributes, PropsWithChildren } from "react";

function SectionLabel({
  children,
  className,
  ...attr
}: PropsWithChildren<HTMLAttributes<HTMLHeadingElement>>) {
  return (
    <div className={cn("w-fit  mb-2", className)}>
      <h2
        className={cn(
          "text-3xl font-bold my-4 capitalize font-work-sans leading-4 text-foreground  text-balance"
        )}
        {...attr}
      >
        {children}
      </h2>
      <div className="w-1/2 h-1  bg-primary rounded-full"></div>
    </div>
  );
}

export default SectionLabel;
