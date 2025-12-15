import Container from "@/components/utils/Container";
import React, { ReactNode } from "react";

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return <Container className="py-5">{children}</Container>;
};

export default AuthLayout;
