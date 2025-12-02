"use client";

import { ComponentProps, forwardRef } from "react";

import { LoaderCircleIcon, SearchIcon } from "lucide-react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
interface InputSearchLoaderProps extends ComponentProps<"input"> {
  isLoading: boolean;
}
const InputSearchLoader = forwardRef<HTMLInputElement, InputSearchLoaderProps>(
  ({ isLoading = false, className, ...attr }, ref) => {
    return (
      <div className="w-full  space-y-2">
        <div className="relative">
          <div className="text-muted-foreground pointer-events-none absolute inset-y-0 left-0 flex items-center justify-center pl-3 peer-disabled:opacity-50">
            <SearchIcon className="size-4" />
            <span className="sr-only">Search</span>
          </div>
          <Input
            ref={ref}
            type="search"
            {...attr}
            className={cn(
              "peer px-9 [&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none [&::-webkit-search-results-button]:appearance-none [&::-webkit-search-results-decoration]:appearance-none",
              className
            )}
          />
          {isLoading && (
            <div className="text-muted-foreground pointer-events-none absolute inset-y-0 right-0 flex items-center justify-center pr-3 peer-disabled:opacity-50">
              <LoaderCircleIcon className="size-4 animate-spin" />
              <span className="sr-only">Loading...</span>
            </div>
          )}
        </div>
      </div>
    );
  }
);

InputSearchLoader.displayName = "InputSearchLoader";

export default InputSearchLoader;
