import React, { ReactNode } from "react";

const Container = ({ children }: { children: ReactNode }) => {
  return (
    <div className="2xl:w-[76rem] 2xl:min-w-[72rem] mx-auto">{children}</div>
  );
};

export default Container;
