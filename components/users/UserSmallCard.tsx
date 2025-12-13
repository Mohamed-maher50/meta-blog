import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserInfo } from "@/types";
import { memo } from "react";
export interface UserSmallCard
  extends Pick<UserInfo, "email" | "name" | "id" | "image"> {}
export interface UserSmallCardProps {
  user: Pick<UserInfo, "email" | "name" | "id" | "image">;
}
export const UserSmallCard = memo(({ user }: UserSmallCardProps) => {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="group block w-72 shrink-0 rounded-2xl border border-border/40 bg-card p-6 shadow-sm transition-all hover:shadow-lg hover:border-primary/30 hover:scale-[1.02] cursor-pointer">
      {/* Avatar Section */}
      <div className="mb-6 flex justify-center">
        <Avatar className="h-24 w-24 border-4 border-primary/20 transition-all group-hover:border-primary/40 group-hover:scale-105">
          <AvatarImage src={user.image || "/placeholder.svg"} alt={user.name} />
          <AvatarFallback className="bg-primary/10 text-2xl font-bold text-primary">
            {getInitials(user.name)}
          </AvatarFallback>
        </Avatar>
      </div>

      {/* User Info */}
      <div className="space-y-2 text-center">
        <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
          {user.name}
        </h3>
        <p className="text-sm overflow-hidden text-muted-foreground text-nowrap text-ellipsis">
          {user.email}
        </p>
      </div>
    </div>
  );
});
export function UserSmallCardSkeleton() {
  return (
    <div className="w-72 shrink-0 rounded-2xl border border-border/40 bg-card p-6 shadow-sm animate-pulse">
      {/* Avatar Skeleton */}
      <div className="mb-6 flex justify-center">
        <div className="h-24 w-24 rounded-full bg-muted/50" />
      </div>

      {/* User Info Skeleton */}
      <div className="space-y-3 text-center">
        <div className="h-6 w-32 mx-auto rounded-md bg-muted/50" />
        <div className="h-4 w-48 mx-auto rounded-md bg-muted/50" />
      </div>
    </div>
  );
}
