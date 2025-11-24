"use client";

import { cn } from "@/lib/utils";
import { Bell } from "lucide-react";
import { ComponentProps } from "react";

export function NotificationEmpty({
  className,
  ...other
}: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-8 px-4 text-center",
        className
      )}
      {...other}
    >
      <div className="mb-3 p-3 rounded-full bg-secondary/50">
        <Bell className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="font-semibold text-foreground mb-1">No Notifications</h3>
      <p className="text-sm text-muted-foreground">
        You&apos;re all caught up. New notifications will appear here.
      </p>
    </div>
  );
}
