import React, { forwardRef } from "react";
import { Input } from "./ui/input";
import { Search } from "lucide-react";

type SearchInputProps = React.ComponentPropsWithoutRef<typeof Input>;

const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  (props, ref) => {
    return (
      <div className="relative">
        <Input
          ref={ref}
          type="search"
          className="min-w-40 placeholder:text-secondary-foreground-400 font-normal text-sm"
          placeholder="Search"
          {...props}
        />
        <Search className=" absolute w-4 h-4  top-0 translate-y-1/2 origin-center right-2  pointer-events-none text-secondary-foreground-600   " />
      </div>
    );
  }
);

SearchInput.displayName = "SearchInput";

export default SearchInput;
