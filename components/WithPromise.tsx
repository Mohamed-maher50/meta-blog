import React, { ComponentType } from "react";

interface WithPromiseProps<T> {
  promise: () => Promise<T>;
  Component: ComponentType<{ data: T }>;
}
const WithPromise = async <T,>({
  promise,
  Component,
}: WithPromiseProps<T[]>) => {
  const result = await promise();
  return <Component data={result} />;
};

export default WithPromise;
