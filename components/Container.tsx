import React, { ReactNode } from "react";

const Container = ({ children }: { children: ReactNode }) => {
  return (
    <div className=" max-md:px-2 px-5 w-full 2xl:w-[76rem] 2xl:min-w-[72rem] mx-auto">
      {children}
    </div>
  );
};

export default Container;
