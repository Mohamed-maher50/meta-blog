import Container from "@/components/Container";
import React, { ReactNode } from "react";

const Layout = ({ children }: { children: ReactNode }) => {
  return <Container>{children}</Container>;
};

export default Layout;
