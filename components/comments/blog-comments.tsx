"use client";

import type React from "react";
import { memo, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import NewCommentForm from "@/components/comments/NewCommentForm";
import { ResponseComment, ResponseSuccess } from "@/types";
import InfiniteScroll from "@/components/ui/InfiniteScroll";
import { Blog } from "@prisma/client";
import { useInfiniteQuery } from "@tanstack/react-query";
import NoComments from "@/components/comments/NoComments";
import CommentCard from "./CommentCard";
import { GetComments } from "@/lib/api/comments";
import { formatCompactNumber } from "@/lib/utils";
interface BlogCommentsProps {
  blogId: string;
  blog: Blog;
}
const BlogComments: React.FC<BlogCommentsProps> = ({ blogId, blog }) => {
  const {
    data: blog_comments,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery<ResponseSuccess<ResponseComment[]>>({
    queryKey: ["blog_comments_query_key"],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await GetComments<ResponseComment>({
        id: blogId,
        query: `?limit=10&page=${pageParam}&orderBy[]=-createdAt`,
      });
      return res;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (!lastPage.pagination.hasNextPage) return undefined;
      return lastPage.pagination.hasNextPage;
    },
  });
  const commentsCount = useMemo(() => {
    const totalComments = blog_comments?.pages[0]
      ? blog_comments.pages[0].pagination.totalItems
      : 0;
    return formatCompactNumber(totalComments);
  }, [blog_comments]);

  return (
    <div className="w-full my-12 ">
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">
            Comments ({commentsCount})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className={" h-72 px-6 pb-4"}>
            <NoComments
              active={blog_comments?.pages[0].pagination.totalItems == 0}
            />
            {blog_comments?.pages.map((p, idx) => {
              return (
                <div className="space-y-2" key={idx}>
                  {p.data.map((comment) => (
                    <CommentCard {...comment} key={comment.id} />
                  ))}
                </div>
              );
            })}

            <InfiniteScroll
              hasMore={hasNextPage}
              isLoading={isFetchingNextPage}
              next={fetchNextPage}
              threshold={1}
            >
              {hasNextPage && (
                <Loader2 className="my-4 text-muted-foreground mx-auto h-8 w-8 animate-spin" />
              )}
            </InfiniteScroll>
          </ScrollArea>

          <NewCommentForm blogId={blogId} blog={blog} />
        </CardContent>
      </Card>
    </div>
  );
};

export default memo(BlogComments);
