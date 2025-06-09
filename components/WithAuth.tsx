"use client";
import { useSession } from "next-auth/react";
import React, { ReactNode } from "react";

const WithAuth = ({ children }: { children: ReactNode }) => {
  const { status } = useSession();
  if (status === "authenticated") return <>{children}</>;
  return null;
};

export default WithAuth;
