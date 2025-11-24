import Container from "@/components/utils/Container";
import React, { ReactNode } from "react";

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="py-10">
      <Container>{children}</Container>
    </div>
  );
};

export default layout;
