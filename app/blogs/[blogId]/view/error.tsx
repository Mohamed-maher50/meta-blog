"use client";

import { Button } from "@/components/ui/button";
import { ExtendingError } from "@/lib/utils";
import Link from "next/link";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: ExtendingError & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);
  const ErrorMessage = error.message || "Something went wrong!";
  const status = error.name || 500;
  return (
    <div className="flex items-center justify-center gap-10 flex-col min-h-96">
      <div className="text-center">
        <h1 className="text-8xl font-extrabold dark:text-primary font-work-sans">
          {status}
        </h1>
        <p className="text-6xl font-bold  font-work-sans   dark:text-primary-foreground text-secondary-foreground-600">
          {ErrorMessage}
        </p>
      </div>
      <div className="flex  gap-2 items-center">
        <Button onClick={() => reset()}>Try again</Button>
        <Button
          onClick={() => reset()}
          variant={"outline"}
          asChild
          className="capitalize"
        >
          <Link href={"/"}>go to home</Link>
        </Button>
      </div>
    </div>
  );
}
