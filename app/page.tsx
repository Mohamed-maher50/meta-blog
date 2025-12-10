import Container from "@/components/utils/Container";
import HeroSection from "@/components/HeroSections";
import { Suspense } from "react";
import SectionLabel from "@/components/miscellaneous/SectionLabel";
import SkeletonCard from "@/components/SkeletonCard";
import DisplayChunk from "@/components/utils/DisplayChunk";
import { GetRecommendedBlogs } from "@/lib/blogs";
import DisplayHomeBlogs from "./_components/DisplayHomeBlogs";
import InfinityBlogsCardsSection from "./_components/InfinityBlogsSection";
import { headers as NextHeaders } from "next/headers";
import { Separator } from "@/components/ui/separator";
import HomeTopicsSwiper from "@/components/topics/TopicsSwiper";

export const BLOGS_SECTIONS = [
  {
    label: "Latest articles 🚀",
    query: "sort=-createdAt&",
    errorMessage: "sorry can't fetch latest blogs",
  },
  {
    label: "Most views",
    query: "sort=-views_count&",
    errorMessage: "sorry can't fetch most viewed blogs",
  },
  {
    label: "Most Loved Articles ❤️",
    query: "sort=-BlogLike&",
    errorMessage: "sorry can't fetch most loved blogs",
  },
];
const SectionsCardsLoadingSkeletons = ({ label }: { label: string }) => (
  <>
    <SectionLabel className="my-8">{label}</SectionLabel>
    <div className="grid gap-5 my-2 grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  </>
);

const Home = async () => {
  return (
    <main className="min-h-screen transition-transform duration-500  font-work-sans">
      <HeroSection />
      <Container>
        <HomeTopicsSwiper
          query="&sort=-topPosition"
          desc="Explore and discover content you love"
          label="🔥Popular Topics"
        />
        <div className="flex justify-between  max-md:flex-col py-10 gap-2">
          <div className="relative flex-col flex gap-10  w-full">
            {BLOGS_SECTIONS.map((section) => {
              return (
                <Suspense
                  key={section.label}
                  fallback={
                    <SectionsCardsLoadingSkeletons label={section.label} />
                  }
                >
                  <DisplayChunk
                    render={({ data }) => {
                      return (
                        <section key={section.label} id={section.label}>
                          <DisplayHomeBlogs
                            blogs={data}
                            label={section.label}
                          />
                          {data.length > 10 && (
                            <InfinityBlogsCardsSection query={section.query} />
                          )}
                          <Separator className="my-5" />
                        </section>
                      );
                    }}
                    errorMessage={() => <>{section.errorMessage}</>}
                    fetcher={async () => {
                      const headers = new Headers(await NextHeaders());
                      return await GetRecommendedBlogs(section.query, {
                        headers,
                      });
                    }}
                  />
                </Suspense>
              );
            })}
          </div>
        </div>
      </Container>
    </main>
  );
};
export default Home;
