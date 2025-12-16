import BlogCardHorizontal from "@/components/blogs/RichBlogCardHorizontal";
import { EmptyStateAlert } from "@/components/EmptyStateAlert";
import { GetBlogs } from "@/lib/blogs";
import { BlogCardProps, ResponseSuccess } from "@/types";
const defaultQuery = {
  omit: "content,authorId",
  page: "1",
  limit: "10",
};
const page = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined | number }>;
}) => {
  const searchParam = await searchParams;
  const search = new URLSearchParams({
    ...searchParam,
    ...defaultQuery,
  } as Record<string, string>);
  if (!search.has("q")) search.delete("q");
  const queryString = search.toString();
  const initialBlogs: ResponseSuccess<BlogCardProps[]> = await GetBlogs(
    queryString
  );
  if (!initialBlogs.pagination.totalItems)
    return <EmptyStateAlert type="blogs" searchQuery={"n"} />;
  return (
    <div className=" gap-2 grid md:grid-cols-2">
      {initialBlogs.data.map((b) => {
        return <BlogCardHorizontal {...b} key={b.id} />;
      })}
      {/* <BlogsWithInfinityScroll  /> */}
    </div>
  );
};

export default page;
