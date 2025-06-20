"use client";

import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";

import { cn } from "@/lib/utils";

function Switch({
  className,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        "peer data-[state=checked]:bg-secondary   scale-150 cursor-pointer data-[state=unchecked]:bg-input focus-visible:border-ring focus-visible:ring-ring/50 dark:data-[state=unchecked]:bg-input/80 inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "bg-background duration-1000   dark:data-[state=checked]:bg-yellow-200  data-[state=checked]:bg-[url(/sun.png)] transition-all data-[state=unchecked]:bg-[url(/moon.png)] bg-size-[10px]  bg-no-repeat bg-center  items-center  justify-center flex dark:data-[state=unchecked]:bg-foreground  pointer-events-none  size-4 rounded-full ring-0  data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0"
        )}
      ></SwitchPrimitive.Thumb>
    </SwitchPrimitive.Root>
  );
}

export { Switch };
