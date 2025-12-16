"use client";
import { useCallback, useRef, useState } from "react";
import InputSearchLoader from "../InputSearchLoader";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { SlidersHorizontal } from "lucide-react";
import debounce from "debounce";
import { useRouter, useSearchParams } from "next/navigation";
const Filtration_bar = () => {
  const searchParams = useSearchParams();
  const [isSearching, setIsSearching] = useState(false);
  const searchInput = useRef<HTMLInputElement | null>(null);
  const router = useRouter();
  const handleSearchInput = () => {
    if (!isSearching) setIsSearching(true);
    if (!searchInput.current) return;
    const url = new URLSearchParams(searchParams);
    if (url.get("q")) url.set("q", searchInput.current.value);
    else url.append("q", searchInput.current.value);
    if (!searchInput.current?.value) url.delete("q");
    debounceRoute(`/favorites/?${url.toString()}`);
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounceRoute = useCallback(
    debounce((url: string) => {
      setIsSearching(false);
      router.push(url);
    }, 1000),
    []
  );
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-8">
      <div className="relative flex-1">
        <InputSearchLoader
          ref={searchInput}
          isLoading={isSearching}
          placeholder="Search..."
          onChange={handleSearchInput}
          defaultValue={searchParams.get("q") as string}
        />
      </div>
      <div className="flex gap-2">
        <Select
          // value={sortBy}
          defaultValue="-createdAt"
          value={searchParams.get("sort") ?? undefined}
          onValueChange={(value) => {
            const url = new URLSearchParams(searchParams);
            if (url.get("sort")) url.set("sort", value);
            else url.append("sort", value);
            router.push(`/favorites/?${url.toString()}`);
          }}
        >
          <SelectTrigger
            className="w-45"
            aria-label="Filtration favorites by newest and oldest"
          >
            <SlidersHorizontal size={16} className="mr-2" />
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="-createdAt">Newest First</SelectItem>
            <SelectItem value="createdAt">Oldest First</SelectItem>
            {/* <SelectItem value="most-read">Most Read</SelectItem> */}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default Filtration_bar;
