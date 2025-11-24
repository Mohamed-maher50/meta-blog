"use client";
import React from "react";
import MultipleSelector, {
  MultipleSelectorProps,
  MultipleSelectorRef,
} from "@/components/ui/multipleSelector";
import { LoaderCircle } from "lucide-react";

const MultipleSelectorWithAsyncSearchAndCreatable = (
  props?: MultipleSelectorProps & React.RefAttributes<MultipleSelectorRef>
) => {
  return (
    <MultipleSelector
      defaultOptions={props?.defaultOptions}
      creatable
      className="bg-secondary-50 dark:bg-background rounded-none"
      placeholder="choose your topics or create new one"
      loadingIndicator={
        <p className="py-2 text-center text-xs leading-10 text-muted-foreground">
          <LoaderCircle className="animate-spin mx-auto my-5" />
        </p>
      }
      emptyIndicator={
        <p className="w-full text-center text-lg leading-10 text-muted-foreground">
          No Results .
        </p>
      }
      {...props}
    />
  );
};

export default MultipleSelectorWithAsyncSearchAndCreatable;
