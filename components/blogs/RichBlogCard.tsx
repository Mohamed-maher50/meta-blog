"use client";

import { Heart, MessageCircle, Eye, Tag, Edit2, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { BlogCardProps } from "@/types";
import SavedButton from "./SavedButton";
import WithAuth from "../auth/WithAuth";
import Link from "next/link";

import { toast } from "sonner";
import { memo, useCallback, useMemo } from "react";
import { formatCompactNumber } from "@/lib/utils";
import axiosClient from "@/lib/axios.client";
const RichBlogCard = ({
  BlogTopics,
  cover,
  createdAt,
  _count,
  readingTime,

  id,
  title,
  views_count,
  author,
  Deletable = false,
  Editable = false,
  favorites,
}: BlogCardProps) => {
  const formattedDate = useMemo(
    () =>
      formatDistanceToNow(new Date(createdAt), {
        addSuffix: true,
      }),
    [createdAt]
  );
  const commentsCount = useMemo(() => {
    return formatCompactNumber(_count.Comment);
  }, [_count.Comment]);
  const likesCount = useMemo(() => {
    return formatCompactNumber(_count.BlogLike);
  }, [_count.BlogLike]);
  const view_count = useMemo(() => {
    return formatCompactNumber(views_count);
  }, [views_count]);
  const deleteBlogHandler = useCallback(async () => {
    const deleteAxiosPromise = axiosClient.delete(`/api/blogs/${id}`);
    toast.promise(deleteAxiosPromise, {
      loading: "please wait ",
      success: `success`,
      error: "something is wrong!",
    });
  }, [id]);
  return (
    <Card className="group relative w-full max-w-sm overflow-hidden transition-all duration-300 hover:shadow-xl">
      <div className="relative h-48 w-full overflow-hidden bg-muted">
        <Image
          src={cover.src || "/placeholder.svg"}
          alt={title}
          width={cover.width}
          height={cover.height}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <WithAuth>
            <>
              <SavedButton blogId={id} isSaved={favorites.length > 0} />
              <Button
                size="icon"
                hidden={!Editable}
                variant="ghost"
                className="bg-background/80 backdrop-blur-sm hover:bg-background shadow-md"
                aria-label="Edit blog"
                asChild
              >
                <Link href={`/blogs/${id}/edit`}>
                  <Edit2
                    size={20}
                    className="text-muted-foreground hover:text-primary"
                  />
                </Link>
              </Button>
              <Button
                onClick={deleteBlogHandler}
                size="icon"
                variant="ghost"
                className="bg-background/80 backdrop-blur-sm hover:bg-destructive/10 shadow-md"
                aria-label="Delete blog"
                hidden={!Deletable}
              >
                <Trash2
                  size={20}
                  className="text-muted-foreground hover:text-destructive"
                />
              </Button>
            </>
          </WithAuth>
        </div>
      </div>

      {/* Content */}
      <CardContent className="space-y-3  pt-4">
        {/* Title */}
        <Link href={`/blogs/${id}/view`}>
          <h3 className="text-lg font-semibold line-clamp-2 text-card-foreground hover:text-primary transition-colors duration-200">
            {title}
          </h3>
        </Link>

        {/* Topics Tags */}
        <div className="flex flex-wrap gap-2">
          {BlogTopics.slice(0, 3).map((bt) => (
            <Badge
              key={bt.topic.id}
              variant="secondary"
              className="flex items-center gap-1"
            >
              <Tag size={12} />
              {bt.topic.label}
            </Badge>
          ))}
        </div>

        {/* Author Info */}
        <div className="flex mt-auto   items-center gap-3 pt-2">
          <Link
            className="relative flex justify-center items-center gap-2 z-20"
            href={`/author/${author.id}`}
          >
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={author.image || "/placeholder.svg"}
                alt={author.name}
              />
              <AvatarFallback>
                {author.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-card-foreground truncate">
                {author.name}
              </p>
              {author.jobTitle && (
                <p className="text-xs text-muted-foreground truncate">
                  {author.jobTitle}
                </p>
              )}
            </div>
          </Link>
        </div>
      </CardContent>

      {/* Metadata and Footer */}
      <CardFooter className="flex  flex-col gap-3 border-t">
        {/* Metadata Row */}
        <div className="flex items-center justify-between w-full text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            {/* Views */}
            <div className="flex items-center gap-1 hover:text-card-foreground transition-colors">
              <Eye size={16} />
              <span>{view_count}</span>
            </div>

            {/* Likes */}
            <div className="flex items-center gap-1 hover:text-primary transition-colors cursor-pointer">
              <Heart size={16} />
              <span>{likesCount}</span>
            </div>

            {/* Comments */}
            <div className="flex items-center gap-1 hover:text-card-foreground transition-colors">
              <MessageCircle size={16} />
              <span>{commentsCount}</span>
            </div>
          </div>

          {/* Reading Time */}
          {readingTime > 0 && (
            <span className="text-xs text-muted-foreground">
              {readingTime} min read
            </span>
          )}
        </div>

        {/* Date */}
        <div className="text-xs text-muted-foreground w-full">
          {formattedDate}
        </div>
      </CardFooter>
    </Card>
  );
};
export default memo(RichBlogCard);
