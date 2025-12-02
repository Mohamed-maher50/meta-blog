import Container from "@/components/utils/Container";
import { FilterTabs } from "@/components/miscellaneous/SearchTabs";
import React, { ReactNode } from "react";

const Layout = async ({
  children,
  S,
}: {
  children: ReactNode;
  S: ReactNode;
}) => {
  return (
    <Container>
      <div className="sm:flex gap-4 py-5     w-full ">
        <div className="  h-fit flex flex-col   flex-5 w-full  gap-3">
          <FilterTabs />
          <div className="flex  gap-2 col-span-full w-full flex-col">
            {children}
          </div>
        </div>
        <div className="md:sticky duration-1000  transform transition-all  min-w-72 max-lg:hidden flex-2 md:top-0 h-full">
          {S}
        </div>
      </div>
    </Container>
  );
};

export default Layout;
