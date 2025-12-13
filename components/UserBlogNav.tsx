"use client";
import {
  LinkedinShareButton,
  LinkedinIcon,
  TwitterShareButton,
  TwitterIcon,
  WhatsappIcon,
  WhatsappShareButton,
} from "next-share";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Bookmark, Heart, Share2 } from "lucide-react";
import React, {
  memo,
  useMemo,
  useOptimistic,
  useState,
  useTransition,
} from "react";
import { Avatar, AvatarImage } from "./ui/avatar";
import { NotificationType } from "@prisma/client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import Link from "next/link";
import { BlogCardProps, IFavorites, ResponseSuccess, UserInfo } from "@/types";
import WithAuth from "./auth/WithAuth";
import { useSession } from "next-auth/react";
import axiosClient from "@/lib/axios.client";

interface UserBlogNavProps {
  user: UserInfo;
  blogId: string;
  isLiked: boolean;
  blog: BlogCardProps;
}
type AddFavoriteArgs = {
  blogId: string;
  signal?: AbortSignal;
};
const UserBlogNav: React.FC<UserBlogNavProps> = ({
  user,
  blogId,
  isLiked,
  blog,
}) => {
  const queryClient = useQueryClient();

  const [isPending, startTransition] = useTransition();
  const [InitialState, setInitialState] = useState(isLiked);
  const session = useSession();
  const { data, isLoading } = useQuery<ResponseSuccess<IFavorites[]>>({
    queryKey: [`saved_blog_${blogId}_status`],
    queryFn: async () => {
      try {
        const { data } = await axiosClient.get(
          `/api/favorites?blogId=${blogId}`
        );
        return data;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        return {};
      }
    },
    enabled: session.status === "authenticated",
  });
  const mutation = useMutation({
    mutationFn: async ({ blogId, signal }: AddFavoriteArgs) => {
      const res = await axiosClient.post(
        `/api/favorites?blogId=${blogId}`,
        { blogId },
        { signal }
      );
      return res.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`saved_blog_${blogId}_status`],
      });
    },

    onError: (error) => {
      console.error("❌ Failed to add favorite:", error);
    },
  });
  const [optimisticLiked, addOptimistic] = useOptimistic(
    InitialState,
    (_, newValue: boolean) => newValue
  );
  const handleToggleLike = async () => {
    startTransition(async () => {
      addOptimistic(!InitialState);

      try {
        const { status } = await axiosClient.post("/api/blogs/liked", {
          blogId,
        });
        if (status == 201) {
          await axiosClient.post("/api/notifications", {
            type: NotificationType.LIKE,
            userId: user.id,
            entityId: blogId,
          });
        }
        setInitialState(!InitialState);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        addOptimistic(InitialState);
      }
    });
  };
  const shareUrl = useMemo(() => {
    // if (!window) return "";
    if (process.env.NODE_ENV === "development") {
      return `https://placehold.co/600x400`;
    }
    return "https://placehold.co/600x400";
    // return `${window.location.origin}/${window.location.pathname}/${blogId}`;
  }, [blogId]);
  const handleSave = async () => {
    const controller = new AbortController();
    await mutation.mutateAsync({ blogId: blogId, signal: controller.signal });
  };
  return (
    <div className="bg-card w-full my-2 mt-6 text-card-foreground border border-border rounded-lg shadow-xs  p-4 hover:bg-muted/50 transition-colors duration-200">
      <div className="flex items-center justify-between">
        {/* Left - User Info */}
        <div className="flex items-center gap-3">
          <Link href={`/author/${user.id}`}>
            <Avatar>
              <AvatarImage
                src={user.image as string}
                width={96}
                height={96}
                alt={user.name ?? "User"}
              />
            </Avatar>
          </Link>
          <div className="flex flex-col">
            <h3 className="font-medium text-sm leading-tight">{user.name}</h3>
            <p className="text-muted-foreground text-xs">{user.email}</p>
          </div>
        </div>

        {/* Right - Actions */}
        <div className="flex items-center gap-2">
          {/* Like */}
          <WithAuth>
            <button
              disabled={isPending}
              className={`p-2 rounded-md  cursor-pointer transition-colors duration-200 hover:bg-muted ${
                optimisticLiked
                  ? "text-red-500 hover:text-red-600"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              aria-pressed={optimisticLiked}
              aria-label={optimisticLiked ? "Unlike" : "Like"}
              onClick={handleToggleLike}
            >
              <Heart
                size={16}
                className={` transition-colors duration-200 ${
                  optimisticLiked ? "fill-current" : ""
                }`}
              />
            </button>

            <button
              className={`p-2 cursor-pointer rounded-md transition-all duration-200 hover:bg-muted ${
                data?.pagination?.totalItems
                  ? "text-primary hover:text-primary/80"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              disabled={isLoading}
              aria-label={data?.pagination?.totalItems ? "Unsave" : "Save"}
              onClick={handleSave}
            >
              <Bookmark
                size={16}
                className={`transition-all duration-200 ${
                  data?.pagination?.totalItems ? "fill-current" : ""
                }`}
              />
            </button>
          </WithAuth>
          {/* Share */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="p-2 rounded-md cursor-pointer transition-all duration-200 hover:bg-muted text-muted-foreground hover:text-foreground data-[state=open]:text-primary data-[state=open]:bg-muted"
                aria-label="Share"
              >
                <Share2 size={16} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="">
              <DropdownMenuItem className="cursor-pointer ">
                <Button asChild>
                  <LinkedinShareButton
                    url={shareUrl}
                    style={{
                      width: "100%",
                      display: "flex",
                      gap: "16px",
                      alignItems: "center",
                    }}
                  >
                    <LinkedinIcon size={32} round />
                    <span>LinkedIn</span>
                  </LinkedinShareButton>
                </Button>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <WhatsappShareButton
                  url={shareUrl}
                  style={{
                    width: "100%",
                    display: "flex",
                    gap: "16px",
                    alignItems: "center",
                  }}
                  title={`Check out "${blog.title}" – a fresh perspective from ${user.name}!`}
                  separator=":: "
                >
                  <WhatsappIcon size={32} round />
                  <span>what&apos;s App</span>
                </WhatsappShareButton>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <TwitterShareButton
                  url={shareUrl}
                  title={`Check out "${blog.title}" – a fresh perspective from ${user.name}!`}
                  style={{
                    width: "100%",
                    display: "flex",
                    gap: "16px",
                    alignItems: "center",
                  }}
                >
                  <TwitterIcon size={32} round />
                  <span>X</span>
                </TwitterShareButton>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default memo(UserBlogNav);
