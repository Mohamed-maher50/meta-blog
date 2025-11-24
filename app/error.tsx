"use client";

import React from "react";

import { ErrorView } from "@/components/errors/ErrorPage";
import {
  ApiResponseError,
  AppError,
  ClientErrorHandler,
} from "@/lib/GlobalErrorHandler";

export type ErrorProps = {
  error: Error & AppError;
  reset?: () => void;
};

export default function Error({ error }: ErrorProps) {
  const processedError = React.useMemo(() => {
    const err = ClientErrorHandler(error) as [
      ApiResponseError,
      {
        status: number;
      }
    ];

    return err;
  }, [error]);
  console.log(processedError);
  return (
    <>
      <ErrorView
        code={processedError[1].status}
        message={processedError[0].message}
        variant="hero"
        title={processedError[0].type}
      />
    </>
  );
}
