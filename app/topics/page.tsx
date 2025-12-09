"use client";
// import InfinityDiscoverTopicsSearch from "../../components/topics/InfinityDiscoverTopics";
import { ChangeEvent, useCallback, useRef, useState } from "react";
import debounce from "debounce";
import InputSearchLoader from "@/components/InputSearchLoader";

const TopicsDiscoverPage = () => {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const searchInput = useRef<null | HTMLInputElement>(null);
  const handleSearchInput = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!isSearching) setIsSearching(true);
    debounceRoute(e.target.value);
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounceRoute = useCallback(
    debounce((value: string) => {
      setQuery(value);
      setIsSearching(false);
    }, 1000),
    []
  );
  return (
    <section className="py-10 flex flex-col gap-2">
      <div className="mb-12">
        <h1 className="text-5xl font-bold text-slate-900 dark:text-white mb-3">
          Topics
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          Explore trending topics and discover communities
        </p>
      </div>
      <InputSearchLoader
        ref={searchInput}
        isLoading={isSearching}
        spellCheck={false}
        placeholder="Explore trending topics  ..."
        className="py-4! my-6 h-12  font-medium font-work-sans text-xl"
        onChange={handleSearchInput}
      />
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {/* <InfinityDiscoverTopicsSearch key={query} query={query} /> */}
      </div>
    </section>
  );
};

export default TopicsDiscoverPage;
