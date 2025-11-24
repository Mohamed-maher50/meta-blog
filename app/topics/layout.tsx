import Container from "@/components/utils/Container";
import React, { ReactNode } from "react";

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Container>{children}</Container>
    </>
  );
};

export default layout;
