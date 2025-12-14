import { auth } from "@/auth";
import RichBlogCard from "@/components/blogs/RichBlogCard";
import WithInfinityFavoritesCards from "@/components/Hocs/WithInfinityFavoritesCards";
import { EmptyState } from "@/components/miscellaneous/EmptyState";
import SelectBar from "@/components/miscellaneous/Select-bar";
import FavoritesAllTabContent from "@/components/sections/FavoritesAllTabContent";
import { Label } from "@/components/ui/label";
import { TabsContent } from "@/components/ui/tabs";
import { GET_USER_FAVORITES } from "@/lib/UserFavoritesBlogs";
import { CompactFavorites } from "@/types";
import { Home } from "lucide-react";
import { headers as NextHeaders } from "next/headers";
import Link from "next/link";
import { Suspense } from "react";
// export const revalidate = 60;
export type FavoritesPageQueryTypes = "sort" | "q";
export type FavoritesPageSearchParamsType = Record<
  FavoritesPageQueryTypes,
  string | undefined
>;
const page = async ({
  searchParams,
}: {
  searchParams: Promise<FavoritesPageSearchParamsType>;
}) => {
  const sp = await searchParams; // Await the promise for Next.js 15+
  const urlSearchParams = new URLSearchParams(sp as Record<string, string>);
  const queryString = urlSearchParams.toString(); // Returns 'query=react&page=1
  console.log(queryString);
  // const session = await auth();
  // if (!session?.user) return;
  // const headers = new Headers(await NextHeaders());
  // const { data, pagination } = await GET_USER_FAVORITES<CompactFavorites[]>(
  //   "?limit=10&page=1",
  //   {
  //     headers,
  //   }
  // );
  return (
    <div className="py-12">
      <Suspense fallback={<>loading...</>}>
        <FavoritesAllTabContent query={`${queryString}`} />
      </Suspense>
      {/* <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {data.map((b) => {
          return (
            <RichBlogCard key={b.blog.id} {...b.blog} Editable Deletable />
          );
        })}
        <WithInfinityFavoritesCards />
        <div
          className="text-center col-span-full my-3"
          hidden={!!pagination.totalItems}
        >
          <Label className="w-full text-center block text-muted-foreground text-lg">
            Looks like your Saved list is empty. Start saving blogs you love!❤️
          </Label>
          <Link
            href={"/"}
            className="underline w-fit items-center flex gap-1.5 mx-auto font-work-sans font-semibold text-secondary-foreground-300"
          >
            <Home size={16} />
            Home
          </Link>
        </div>
      </div> */}
    </div>
  );
};

export default page;
