"use client";

import { CloudCog, UserMinus, UserPlus } from "lucide-react";
import React, { use, useOptimistic, useState, useTransition } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";
import { NotificationType } from "@prisma/client";
import { useSession } from "next-auth/react";
import axiosClient from "@/lib/axios.client";

const FollowButton = ({
  params,
  isFollowed,
}: {
  isFollowed: boolean;
  params: Promise<{ userId: string }>;
}) => {
  const { userId } = use(params);
  const [following, setFollowing] = useState(isFollowed);
  const session = useSession();
  const unFollowHandle = async () => {
    setFollowing(false)
    try {
      const { status } = await axiosClient.delete(
        `/api/users/${userId}/follow`
      );

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setFollowing(true);
    }

  };
  const followHandle = async () => {

    try {
      setFollowing(true)
      const { status } = await axiosClient.patch(
        `/api/users/${userId}/follow`
      );
      await axiosClient.post("/api/notifications", {
        type: NotificationType.FOLLOW,
        userId: userId,
        entityId: session.data?.user.userId,
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setFollowing(false);
    }

  };

  const handleFollow = async () => {
    if (following) unFollowHandle();
    else followHandle();
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          key={isFollowed ? "followed" : "not-followed"}
          size={"sm"}
          variant={"outline"}
          className="flex-shrink-0 rounded-full px-4 h-8 text-sm font-medium"
          aria-pressed={isFollowed}
          aria-label={
            isFollowed
              ? `Unfollow ${"userName"}`
              : `Follow ${"userName"}`
          }
        >
          {following ? (
            <>
              <UserMinus className="h-4 w-4" />
              Unfollow
            </>
          ) : (
            <>
              <UserPlus className="h-4 w-4" />
              Follow
            </>
          )}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
        <AlertDialogDescription>
          This action cannot be undone. This will permanently delete your
          account and remove your data from our servers.
        </AlertDialogDescription>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleFollow}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default FollowButton;
