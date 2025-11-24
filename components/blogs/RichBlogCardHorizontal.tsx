"use client";

import { Heart, MessageCircle, Eye, Tag, Edit2, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { BlogCardProps } from "@/types";
import axios from "axios";
import { toast } from "sonner";
import Image from "next/image";
import WithAuth from "../auth/WithAuth";
import SavedButton from "./SavedButton";
import Link from "next/link";
import { memo } from "react";

const BlogCardHorizontal = ({
  BlogTopics,
  _count,
  author,
  cover,
  createdAt,
  favorites,
  id,
  title,
  views_count,
  readingTime,
  Deletable = false,
  Editable = false,
}: BlogCardProps) => {
  const formattedDate = formatDistanceToNow(new Date(createdAt), {
    addSuffix: true,
  });

  const likesCount = _count.BlogLike || 0;
  const commentsCount = _count.Comment || 0;
  const deleteBlogHandler = async () => {
    const deleteAxiosPromise = axios.delete(`/api/blogs/${id}`);

    toast.promise(deleteAxiosPromise, {
      loading: "please wait ",
      success: `success`,
      error: "something is wrong!",
    });
  };

  return (
    <Card className="group relative w-full overflow-hidden transition-all duration-300 hover:shadow-lg">
      <CardContent className="p-0">
        <div className="flex gap-4 p-4">
          {/* Cover Image - Left Side */}
          <div className="relative h-32 w-40 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
            <Image
              width={cover.width}
              height={cover.height}
              src={cover.src || "/placeholder.svg"}
              alt={title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
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

          {/* Content - Right Side */}
          <div className="flex-1 flex flex-col justify-between min-w-0">
            {/* Title and Topics */}
            <div className="space-y-2">
              <Link href={`/blogs/${id}/view`}>
                <h3 className="text-lg font-semibold line-clamp-2 text-card-foreground hover:text-primary transition-colors duration-200">
                  {title}
                </h3>
              </Link>

              <div className="flex flex-wrap gap-1">
                {BlogTopics.slice(0, 2).map((bt) => (
                  <Badge
                    key={bt.topic.id}
                    variant="secondary"
                    className="text-xs flex items-center gap-1"
                  >
                    <Tag size={10} />
                    {bt.topic.label}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Author and Metadata */}
            <div className="space-y-2">
              {/* Author Info */}

              <div className="flex items-center gap-2">
                <Link
                  className="relative hover:scale-105 duration-500 hover:-translate-y-2 flex justify-center items-center gap-2 z-20"
                  href={`/author/${author.id}`}
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={author.image || "/placeholder.svg"}
                      alt={author.name}
                    />
                    <AvatarFallback>
                      {author.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-card-foreground truncate">
                      {author.name}
                    </p>
                    {author.jobTitle && (
                      <p className="text-xs text-muted-foreground truncate">
                        {author.jobTitle}
                      </p>
                    )}
                  </div>{" "}
                </Link>
              </div>

              {/* Metadata Row */}
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-3">
                  {/* Views */}
                  <div className="flex items-center gap-1 hover:text-card-foreground transition-colors">
                    <Eye size={14} />
                    <span>{views_count}</span>
                  </div>

                  {/* Likes */}
                  <div className="flex items-center gap-1 hover:text-primary transition-colors cursor-pointer">
                    <Heart size={14} />
                    <span>{likesCount}</span>
                  </div>

                  {/* Comments */}
                  <div className="flex items-center gap-1 hover:text-card-foreground transition-colors">
                    <MessageCircle size={14} />
                    <span>{commentsCount}</span>
                  </div>
                </div>

                {/* Reading Time and Date */}
                <div className="flex items-center gap-2">
                  {readingTime > 0 && <span>{readingTime} min</span>}
                  <span>•</span>
                  <span>{formattedDate}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
export default memo(BlogCardHorizontal);
