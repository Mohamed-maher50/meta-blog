import { auth } from "@/auth";
import RichBlogCard from "@/components/blogs/RichBlogCard";
import WithInfinityFavoritesCards from "@/components/Hocs/WithInfinityFavoritesCards";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { GET_USER_FAVORITES } from "@/lib/UserFavoritesBlogs";
import { CompactFavorites } from "@/types";
import { RiHeart3Fill } from "@remixicon/react";
import { Home } from "lucide-react";
import { headers as NextHeaders } from "next/headers";
import Link from "next/link";
import React from "react";
// export const revalidate = 60;
const page = async () => {
  const session = await auth();
  if (!session?.user) return;
  const headers = new Headers(await NextHeaders());
  const { data, pagination } = await GET_USER_FAVORITES<CompactFavorites[]>(
    "?limit=10&page=1",
    {
      headers,
    }
  );
  return (
    <div className="py-12">
      <div className="flex justify-between items-center">
        <div className="flex gap-1">
          <Avatar>
            <AvatarImage src={session.user.image as string} />
            <AvatarFallback>{session.user.name.slice(0, 1)}</AvatarFallback>
          </Avatar>
          <div>
            <Label className="text-secondary-foreground-800 dark:text-secondary-50">
              {session.user.name}
            </Label>
            <Label className="text-secondary-foreground-400 dark:text-secondary-foreground-300 ">
              {session.user.email}
            </Label>
          </div>
        </div>
        <h1 className="text-2xl flex items-center gap-1.5 font-work-sans font-semibold ">
          Saved
          <RiHeart3Fill className="text-red-500" />
        </h1>
      </div>
      <Separator className="my-4" />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
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
      </div>
    </div>
  );
};

export default page;
