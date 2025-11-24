"use client";

import { Filters, FilterTabsProps, SearchResults } from "@/types";
import { useCallback, useState } from "react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { X } from "lucide-react";

const defaultFilters: Filters = {
  topics: [],
  authors: [],
  q: "",
  dateFrom: undefined,
  dateTo: undefined,
  minPopularity: 0,
  maxPopularity: 10000,
};

const defaultSearchResults: SearchResults = {
  topics: [],
  authors: [],
  blogs: [],
};

interface FilterTabsPropsExtended extends FilterTabsProps {
  searchTerm?: string;
}

export function FilterTabs({
  searchResults = defaultSearchResults,
  value,
  onChange,
  className,
}: FilterTabsPropsExtended) {
  const [internalFilters, setInternalFilters] =
    useState<Filters>(defaultFilters);
  const searchParams = useSearchParams();
  const path = usePathname();
  const router = useRouter();

  // Use controlled or uncontrolled state
  const filters = value || internalFilters;
  const updateFilters = useCallback(
    (newFilters: Filters) => {
      if (onChange) {
        onChange(newFilters);
      } else {
        setInternalFilters(newFilters);
      }
    },
    [onChange]
  );

  const clearAllFilters = () => {
    updateFilters(defaultFilters);
  };

  const hasActiveFilters =
    filters.topics.length > 0 ||
    filters.authors.length > 0 ||
    filters.q ||
    filters.dateFrom ||
    filters.dateTo ||
    filters.minPopularity !== 0 ||
    filters.maxPopularity !== 10000;

  const navigationItems = [
    {
      id: "blogs",
      label: "Blogs",
      count: searchResults.blogs.length,
    },
    {
      id: "users",
      label: "People",
      count: searchResults.authors.length,
    },
    {
      id: "topics",
      label: "Topics",
      count: searchResults.topics.length,
    },
  ];

  return (
    <div className={cn("w-full space-y-6", className)}>
      <div className="flex items-center justify-between">
        <h1 className="text-4xl">
          <span className="text-muted-foreground font-work-sans font-normal">
            Results for{" "}
          </span>
          <span className="text-foreground font-semibold">
            {searchParams.get("q")}
          </span>
        </h1>
        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={clearAllFilters}
            className="text-muted-foreground hover:text-foreground bg-transparent"
          >
            <X className="h-4 w-4 mr-1" />
            Clear All Filters
          </Button>
        )}
      </div>

      <div className="w-full">
        <nav
          className="flex items-center space-x-8 border-b border-border"
          role="navigation"
          aria-label="Search result categories"
        >
          {navigationItems.map((item) => {
            const isActive = path.endsWith(item.id);
            return (
              <button
                key={item.id}
                onClick={() =>
                  router.push(`/search/${item.id}?q=${searchParams.get("q")}`)
                }
                className={cn(
                  "relative pb-3 px-1 text-sm font-medium transition-colors duration-200 border-b-2 border-transparent",
                  isActive
                    ? "text-foreground border-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
                aria-pressed={isActive}
                aria-controls={`${item.id}-panel`}
              >
                {item.label}
                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground" />
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
