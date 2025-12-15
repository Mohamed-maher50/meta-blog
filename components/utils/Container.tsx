import { cn } from "@/lib/utils";
import React, { HTMLAttributes, PropsWithChildren } from "react";
type ContainerProps = PropsWithChildren<HTMLAttributes<HTMLDivElement>>;
const Container = ({ children, className, ...attr }: ContainerProps) => {
  return (
    <div
      className={cn(
        " max-md:px-2 px-5 max-sm:w-11/12 w-full 2xl:w-7xl 2xl:min-w-6xl mx-auto",
        className
      )}
      {...attr}
    >
      {children}
    </div>
  );
};

export default Container;
