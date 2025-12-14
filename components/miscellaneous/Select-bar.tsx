import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { ReactNode } from "react";

const SelectBar = ({ children }: { children: ReactNode }) => {
  return (
    <Tabs className="w-full" defaultValue="all">
      <TabsList className="grid w-full max-w-md grid-cols-3 ga mb-8">
        <TabsTrigger value="all">All</TabsTrigger>
        <TabsTrigger value="blogs">Blogs</TabsTrigger>
        <TabsTrigger value="topics">Topics</TabsTrigger>
      </TabsList>

      {children}
    </Tabs>
  );
};

export default SelectBar;
