"use client";

import React, {
  useEffect,
  useMemo,
  useOptimistic,
  useState,
  useTransition,
} from "react";
import InfiniteScroll from "../ui/InfiniteScroll";
import { AxiosResponse } from "axios";
import { Bell, Loader2 } from "lucide-react";

import { NotificationWithActor, ResponseSuccess } from "@/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { NotificationMinimal } from "./NotificationCard";
import { pusherClient } from "@/lib/pusherClinet";
import { useSession } from "next-auth/react";
import { NotificationEmpty } from "./NotificationEmpty";
import axiosClient from "@/lib/axios.client";

const NotificationsDropDownMenu = () => {
  const [page, setPage] = React.useState(1);
  const [loading, setLoading] = React.useState(false);
  const [hasMore, setHasMore] = React.useState(true);
  const [notifications, setNotifications] = useState<
    NotificationWithActor[] | null
  >(null);
  const { data } = useSession();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isPending, startTransition] = useTransition();
  const [optimistic, setOptimistic] = useOptimistic<
    NotificationWithActor[] | null
  >(notifications);
  const unreadNotifications = useMemo(() => {
    return notifications?.filter((n) => !n.read) || [];
  }, [notifications]);
  useEffect(() => {
    if (data?.user.userId) {
      const channel = pusherClient.subscribe(
        `private-user-${data.user.userId}`
      );
      const event = channel.bind(
        "new-notification",
        (data: NotificationWithActor) => {
          setNotifications((prev) => {
            if (!prev) return [data];
            return [data, ...prev];
          });
        }
      );

      return () => {
        channel.unsubscribe();
        event.unbind();
        pusherClient.disconnect();
      };
    }
  }, [data?.user.userId]);
  const next = async () => {
    setLoading(true);

    try {
      const {
        data,
        status,
      }: AxiosResponse<ResponseSuccess<NotificationWithActor[]>> =
        await axiosClient.get(
          `/api/notifications?limit=10&page=${page}&includes=actor&orderBy[]=-createdAt`
        );
      if (status != 200) throw new Error("can't fetch notifications");
      setNotifications((prev) => {
        if (prev == null) return data.data;
        return [...prev, ...data.data];
      });
      setPage((prev) => prev + 1);

      if (data.data.length < 10) setHasMore(false);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };
  const handleOnCloseDropDown = async (status: boolean) => {
    if (status) return;
    if (!notifications || notifications.length === 0) return;
    const unreadNotifications = notifications.filter((n) => !n.read);
    const updatedNotifications = notifications.map((n) => ({
      ...n,
      read: true,
    }));
    if (unreadNotifications.length === 0) return;
    const ids = unreadNotifications.map((n) => n.id);
    if (ids.length === 0) return;
    startTransition(async () => {
      try {
        setOptimistic(updatedNotifications);
        const { status: responseStatus } = await axiosClient.patch(
          "/api/notifications/read",
          {
            ids,
          }
        );
        if (responseStatus == 200) {
          setNotifications(updatedNotifications);
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        setOptimistic(notifications);
      }
    });
  };
  return (
    <div>
      <DropdownMenu onOpenChange={handleOnCloseDropDown}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="relative rounded-full bg-secondary text-secondary-foreground hover:bg-secondary-100 transition"
          >
            <Bell className="h-5 w-5" />
            {unreadNotifications.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-white text-xs flex items-center justify-center rounded-full">
                {unreadNotifications.length}
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className="w-96 max-sm:w-full rounded-xl bg-card border border-border shadow-lg"
        >
          <DropdownMenuLabel className="text-sm font-semibold text-foreground">
            Notifications
          </DropdownMenuLabel>
          <DropdownMenuSeparator />

          {optimistic?.map((n) => {
            return (
              <DropdownMenuItem key={n.id}>
                <NotificationMinimal notification={n} />
              </DropdownMenuItem>
            );
          })}
          <NotificationEmpty hidden={!!optimistic?.length} />

          <DropdownMenuSeparator hidden={!optimistic?.length} />
          <InfiniteScroll
            hasMore={hasMore}
            isLoading={loading}
            next={next}
            threshold={1}
          >
            {hasMore && (
              <Loader2 className="my-4 text-muted-foreground mx-auto h-8 w-8 animate-spin" />
            )}
          </InfiniteScroll>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default NotificationsDropDownMenu;
