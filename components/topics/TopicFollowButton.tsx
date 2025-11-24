"use client";
import axios from "axios";
import React, { use, useOptimistic, useState, useTransition } from "react";

import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

const TopicFollowButton = ({
  params,
  isFollowed,
}: {
  isFollowed: boolean;
  params: Promise<{ topicId: string }>;
}) => {
  const { topicId } = use(params);
  const [following, setFollowing] = useState(isFollowed);
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const [followingOptimistic, setFollowingOptimistic] =
    useOptimistic(following);
  const unFollowHandle = () => {
    startTransition(async () => {
      try {
        setFollowingOptimistic(false);
        const { status } = await axios.delete(`/api/topics/${topicId}/follow`);
        if (status === 204) {
          setFollowing(false);
          router.refresh();
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        setFollowingOptimistic(true);
      }
    });
  };
  const followHandle = () => {
    startTransition(async () => {
      try {
        setFollowingOptimistic(true);
        const { status } = await axios.post(`/api/topics/${topicId}/follow`);
        if (status !== 201) setFollowingOptimistic(false);
        setFollowing(true);
        router.refresh();

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        setFollowingOptimistic(false);
      }
    });
  };

  const handleFollow = async () => {
    if (following) unFollowHandle();
    else followHandle();
  };

  return (
    <Button
      key={followingOptimistic ? "followed" : "not-followed"}
      size={"sm"}
      variant={followingOptimistic ? "outline" : "default"}
      className={`
        rounded-lg px-4 py-2 capitalize font-medium inline-flex items-center gap-2 transition-colors duration-200
        ${
          followingOptimistic
            ? "bg-secondary border-secondary text-secondary-foreground hover:bg-secondary/90"
            : "bg-primary border-primary border text-primary-foreground hover:bg-primary/90"
        }
      `}
      onClick={handleFollow}
      disabled={pending}
      aria-pressed={followingOptimistic}
      aria-label={
        followingOptimistic ? `Unfollow ${"userName"}` : `Follow ${"userName"}`
      }
    >
      {followingOptimistic ? <>following</> : <>Follow</>}
    </Button>
  );
};

export default TopicFollowButton;
