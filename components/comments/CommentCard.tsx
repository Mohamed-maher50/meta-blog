import React, { useMemo, useOptimistic, useState, useTransition } from "react";
import { ResponseComment } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { Heart } from "lucide-react";

import { useSession } from "next-auth/react";
import { NotificationType } from "@prisma/client";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import axiosClient from "@/lib/axios.client";

const CommentCard = ({
  id,
  author,
  CommentLike,
  content,
  createdAt,
  blogId,
}: ResponseComment) => {
  const { data } = useSession();
  const isLikedBefore = useMemo(
    () => CommentLike.some((v) => v.userId == data?.user.userId),
    [CommentLike, data?.user.userId]
  );
  const [isLiked, setIsLiked] = useState(isLikedBefore);
  const [optimisticLikeState, setOptimisticLikeState] = useOptimistic(isLiked);
  const [isPending, startTransition] = useTransition();

  const handleLikeComment = async () => {
    startTransition(async () => {
      setOptimisticLikeState((prev) => !prev);

      try {
        if (isLiked) {
          const { status } = await axiosClient.delete(
            `/api/blogs/${blogId}/comments/${id}/likes`
          );
          if (status != 204) throw new Error("Failed to unlike the comment");
          setIsLiked(false);
        } else {
          const { status } = await axiosClient.post(
            `/api/blogs/${blogId}/comments/${id}/likes`
          );
          if (status != 201) throw new Error("Failed to like the comment");
          await axiosClient.post("/api/notifications", {
            type: NotificationType.CommentLike,
            userId: author.id,
            entityId: id,
          });
          setIsLiked(true);
        }
      } catch (error) {
        setOptimisticLikeState(isLiked);
        console.log(error);
      }
    });
  };

  const OptimalTime = useMemo(() => {
    return formatDistanceToNow(createdAt, { addSuffix: true });
  }, [createdAt]);
  const totalLikes = useMemo(() => {
    return isLikedBefore ? CommentLike.length - 1 : CommentLike.length;
  }, [CommentLike.length, isLikedBefore]);

  return (
    <div className="group p-4 rounded-lg border border-border hover:border-primary/20 hover:bg-accent/50 transition-all duration-200">
      <div className="flex gap-3">
        <Avatar>
          <AvatarImage
            src={author.image || "/placeholder.svg"}
            alt={author.name}
          />
          <AvatarFallback className="bg-secondary uppercase! font-semibold text-secondary-foreground">
            {author.name?.slice(0, 1)}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-medium text-foreground text-sm">
              {author.name}
            </h4>
            <span className="text-xs text-muted-foreground">{OptimalTime}</span>
          </div>

          <p className="text-sm text-foreground leading-relaxed mb-3">
            {content}
          </p>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              disabled={isPending}
              size="sm"
              onClick={handleLikeComment}
              className={`h-8 px-2 gap-1 hover:bg-primary/10 ${
                optimisticLikeState
                  ? "text-primary hover:text-primary"
                  : "text-muted-foreground hover:text-primary"
              }`}
            >
              <Heart
                className={`h-3 w-3 ${
                  optimisticLikeState ? "fill-current" : ""
                }`}
              />
              <span className="text-xs">
                {optimisticLikeState ? totalLikes + 1 : totalLikes}
              </span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentCard;
