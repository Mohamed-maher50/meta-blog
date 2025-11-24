"use client";

import { formatDistanceToNow } from "date-fns";
import { getNotificationColor, NotificationIcon } from "./notification-icons";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { NotificationWithActor } from "@/types";
import Link from "next/link";

interface NotificationMinimalProps {
  notification: NotificationWithActor;
  onClick?: () => void;
}

export function NotificationMinimal({
  notification,
  onClick,
}: NotificationMinimalProps) {
  const timeAgo = formatDistanceToNow(notification.createdAt, {
    addSuffix: true,
  });
  const iconColor = getNotificationColor(notification.type);
  const url =
    notification.type === "COMMENT" ? "/blogs/" + notification.entityId : "#";
  return (
    <div
      className={`
        flex items-start relative isolate w-full gap-2 py-2 px-3 rounded-md cursor-pointer transition-colors
        hover:bg-accent/50 group text-sm max-w-full
        ${!notification.read ? "bg-accent/10" : ""}
      `}
      onClick={onClick}
    >
      <Link href={url} className="inset-0 absolute z-10 " />
      <div className={`flex-shrink-0 ${iconColor} mt-0.5`}>
        <NotificationIcon
          type={notification.type}
          className={cn("w-3.5 h-3.5", iconColor)}
        />
      </div>

      <Image
        src={notification.actor.image || "https://i.pravatar.cc/90"}
        alt={notification.actor.name}
        width={60}
        height={60}
        className="w-6 h-6 rounded-full object-cover flex-shrink-0 mt-0.5"
      />

      <div className="flex-1 min-w-0 max-w-[280px]">
        <div className="font-medium text-foreground leading-tight truncate">
          {notification.actor.name}
        </div>
        <div className="text-muted-foreground text-xs leading-relaxed line-clamp-2 mt-0.5">
          {notification.message}
        </div>
      </div>

      <div className="flex items-center gap-1.5 flex-shrink-0 mt-0.5">
        <span className="text-xs ml-auto text-muted-foreground group-hover:text-foreground transition-colors whitespace-nowrap">
          {timeAgo.replace(" ago", "")}
        </span>
        {!notification.read && (
          <div className="w-1 h-1 bg-primary rounded-full" />
        )}
      </div>
    </div>
  );
}
