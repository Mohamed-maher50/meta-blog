import React, { Suspense } from "react";
import SectionLabel from "../miscellaneous/SectionLabel";
import SkeletonCard from "../SkeletonCard";
import { headers as NextHeaders } from "next/headers";
import { GridBlogs } from "@/app/_components/DisplayHomeBlogs";
import InfinityBlogsCardsSection from "../../app/_components/InfinityBlogsSection";
import { ErrorBoundary } from "react-error-boundary";
import { GetRecommendedBlogs } from "@/lib/blogs";
import { ErrorMessage } from "../topics/TopicsSwiper";
const SectionsCardsLoadingSkeletons = () => (
  <>
    <div className="grid gap-5 my-2 grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  </>
);
interface HomeBlogSection {
  label: string;
  query: string;
}

const ChunkBlogs = async ({ query }: { query: string }) => {
  const headers = new Headers(await NextHeaders());
  const res = await GetRecommendedBlogs(query, {
    headers,
    next: { revalidate: 60 },
  });
  console.log(res);
  return (
    <>
      <GridBlogs blogs={res.data}>
        {res.pagination.hasNextPage && (
          <InfinityBlogsCardsSection query={query} />
        )}
      </GridBlogs>
    </>
  );
};
const HomeBlogSection = async ({ label, query }: HomeBlogSection) => {
  return (
    <section>
      <SectionLabel>{label}</SectionLabel>
      <ErrorBoundary
        fallback={<ErrorMessage message={`can't fetch ${label} blog`} />}
      >
        <Suspense fallback={<SectionsCardsLoadingSkeletons />}>
          <ChunkBlogs query={query} />
        </Suspense>
      </ErrorBoundary>
    </section>
  );
};

export default HomeBlogSection;
