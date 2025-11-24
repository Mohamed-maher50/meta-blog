import Container from "@/components/utils/Container";
import React, { ReactNode } from "react";

const Layout = ({ children }: { children: ReactNode }) => {
  return <Container className="lg:px-20">{children}</Container>;
};

export default Layout;
