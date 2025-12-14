import RichBlogCard from "../blogs/RichBlogCard";
import { EmptyState } from "../miscellaneous/EmptyState";
import { SectionsCardsLoadingSkeletons } from "./HomeBlogSection";
import { baseUrl } from "@/lib/baseUrl";
import { headers as NextHeaders } from "next/headers";
import InfinityBlogsCardsSection from "../../app/_components/InfinityBlogsSection";
import { BlogCardProps, ResponseSuccess } from "@/types";
import { Suspense } from "react";
interface FavoritesBlogCardProps {
  id: string;
  blogId: string;
  userId: string;
  createdAt: string;
  blog: BlogCardProps;
}
export const ChunkBlogs = async ({ query }: { query: string }) => {
  const headers = await NextHeaders();
  const res = await fetch(
    `${baseUrl}/api/blogs/favorites?omit=content&${query}`,
    {
      headers: new Headers(headers),
      next: {
        revalidate: 60,
      },
    }
  );
  const {
    pagination,
    data,
    success,
  }: ResponseSuccess<FavoritesBlogCardProps[]> = await res.json();
  if (!success) return;
  return (
    <>
      {pagination.totalItems == 0 && (
        <EmptyState
          title="No favorites found"
          description={
            query
              ? "Try adjusting your search to find what you're looking for"
              : "Start exploring and save your favorite blogs and topics to see them here"
          }
        />
      )}
      <div className="grid gap-2 max-sm:place-items-center place-content-center my-2 grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
        {data.map((b) => {
          return <RichBlogCard {...b.blog} key={b.id} />;
        })}
        {pagination.hasNextPage && (
          <InfinityBlogsCardsSection query={`${query}&`} />
        )}
      </div>
    </>
  );
};
const FavoritesAllTabContent = async ({ query }: { query: string }) => {
  return (
    <div className="space-y-8">
      {/* Blogs Section */}
      <h2 className="text-2xl font-semibold mb-4 text-foreground">
        Saved Blogs
      </h2>
      <Suspense fallback={<SectionsCardsLoadingSkeletons />}>
        <ChunkBlogs query={query} />
      </Suspense>
    </div>
  );
};

export default FavoritesAllTabContent;
