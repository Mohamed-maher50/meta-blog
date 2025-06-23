"use client";
import NotFoundMessage from "@/components/NotFoundMessage";
import React from "react";

const notFound = () => {
  return (
    <NotFoundMessage
      ErrorTitle="Blog not found"
      ErrorDescription="The blog you are looking for does not exist or may have been removed."
    />
  );
};

export default notFound;
