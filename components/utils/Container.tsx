import { cn } from "@/lib/utils";
import React, { HTMLAttributes, PropsWithChildren } from "react";
type ContainerProps = PropsWithChildren<HTMLAttributes<HTMLDivElement>>;
const Container = ({ children, className, ...attr }: ContainerProps) => {
  return (
    <div
      className={cn(
        " max-md:px-2 px-5 w-full 2xl:w-[80rem] 2xl:min-w-[72rem] mx-auto",
        className
      )}
      {...attr}
    >
      {children}
    </div>
  );
};

export default Container;
