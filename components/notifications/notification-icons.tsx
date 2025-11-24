import { NotificationType } from "@prisma/client";
import {
  MessageCircle,
  Heart,
  UserPlus,
  FileText,
  ThumbsUp,
} from "lucide-react";

interface NotificationIconProps {
  type: NotificationType;
  className?: string;
}

export function NotificationIcon({
  type,
  className = "w-4 h-4",
}: NotificationIconProps) {
  const iconMap = {
    [NotificationType.BLOG]: FileText,
    [NotificationType.LIKE]: Heart,
    [NotificationType.FOLLOW]: UserPlus,
    [NotificationType.COMMENT]: MessageCircle,
    [NotificationType.CommentLike]: ThumbsUp,
  };

  const Icon = iconMap[type];
  return <Icon className={className} />;
}

export function getNotificationColor(type: NotificationType): string {
  const colorMap = {
    [NotificationType.BLOG]: "text-chart-3",
    [NotificationType.LIKE]: "text-chart-5",
    [NotificationType.FOLLOW]: "text-chart-2",
    [NotificationType.COMMENT]: "text-chart-1",
    [NotificationType.CommentLike]: "text-blue-600",
  };

  return colorMap[type];
}
