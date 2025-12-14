import { ReactNode, Suspense } from "react";
import SectionLabel from "../miscellaneous/SectionLabel";
import SkeletonCard from "../SkeletonCard";
import { headers as NextHeaders } from "next/headers";
import InfinityBlogsCardsSection from "../../app/_components/InfinityBlogsSection";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorMessage } from "../topics/TopicsSwiper";
import { getTopics } from "@/lib/Topics";
import {
  FavoriteTopicCard,
  FavoriteTopicCardProps,
} from "../topics/FavoriteTopicCard";
export function GridTopics({
  topics,
  children,
}: {
  topics: FavoriteTopicCardProps[];
  children?: ReactNode;
}) {
  return (
    <div className="grid gap-2 max-sm:place-items-center place-content-center my-2 grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
      {topics.map((b) => {
        return <FavoriteTopicCard {...b} key={b.topic.id} />;
      })}
      {children}
    </div>
  );
}
const SectionsCardsLoadingSkeletons = () => (
  <>
    <div className="grid gap-5 my-2 grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  </>
);
interface TopicsSection {
  label: string;
  query: string;
}

const ChunkTopics = async ({ query }: { query: string }) => {
  const headers = new Headers(await NextHeaders());
  const res = await getTopics(query);
  return (
    <>
      <GridTopics topics={res.data}>
        {res.pagination.hasNextPage && (
          <InfinityBlogsCardsSection query={query} />
        )}
      </GridTopics>
    </>
  );
};
const TopicsSection = async ({ label, query }: TopicsSection) => {
  return (
    <section>
      <SectionLabel>{label}</SectionLabel>
      <ErrorBoundary
        fallback={<ErrorMessage message={`can't fetch ${label} blog`} />}
      >
        <Suspense fallback={<SectionsCardsLoadingSkeletons />}>
          <ChunkTopics query={query} />
        </Suspense>
      </ErrorBoundary>
    </section>
  );
};

export default TopicsSection;
