"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserInfo } from "@/types";
import FollowButton from "../utils/FollowButton";
import WithAuth from "../auth/WithAuth";
export interface UserSuggestionCardProps {
  user: UserInfo & { isFollowing: boolean };
  onFollowToggle?: (userId: string, isFollowing: boolean) => void;
}

export function UserSuggestionCard({ user }: UserSuggestionCardProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  };

  const displayText = user.bio || user.jobTitle || "No description available";

  return (
    <div className="flex items-center gap-3 p-3  rounded-lg bg-background hover:bg-accent/50 transition-colors">
      <Avatar className="h-10 w-10 flex-shrink-0">
        <AvatarImage src={user.image || undefined} alt={user.name} />
        <AvatarFallback className="bg-muted text-muted-foreground">
          {getInitials(user.name)}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-sm text-foreground leading-tight">
          {user.name}
        </h3>
        <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">
          {truncateText(displayText, 60)}
        </p>
      </div>
      <WithAuth>
        <FollowButton
          isFollowed={user.isFollowing}
          params={new Promise((res) => res({ userId: user.id }))}
        />
      </WithAuth>
    </div>
  );
}
