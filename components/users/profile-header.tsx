import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  Linkedin,
  Twitter,
  Globe,
  Mail,
  Instagram,
  Facebook,
} from "lucide-react";
import { UserInfo } from "@/types";
import { EditProfileDialog } from "./edit-profile-dialog";
import Link from "next/link";
import { Button } from "../ui/button";
import FollowButton from "../utils/FollowButton";
import WithAuth from "../auth/WithAuth";

interface ProfileHeaderProps {
  user: UserInfo & { isFollowing: boolean };
  isOwnProfile?: boolean;
  onFollowToggle?: (isFollowing: boolean) => void;
}

export function ProfileHeader({
  user,
  isOwnProfile = false,
}: ProfileHeaderProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const socialIcons = {
    instagram: Instagram,
    linkedin: Linkedin,
    twitter: Twitter,
    website: Globe,
    facebook: Facebook,
  };

  return (
    <div className="space-y-8">
      {/* Profile Info */}
      <div className="flex items-start justify-between">
        <div className="flex max-sm:flex-col gap-6">
          <Avatar className="h-24 w-24 border-2 border-border">
            <AvatarImage
              src={
                user.image ||
                "https://lh3.googleusercontent.com/a/ACg8ocJnHXmtzvtuyePhuPkY_Y7gPUVQ57C5s-ZdKHydcGG0JQ9NJSv8=s96-c"
              }
              alt={user.name}
            />
            <AvatarFallback className="text-2xl">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-balance">{user.name}</h1>
            {user.jobTitle ? (
              <p className="text-lg capitalize text-muted-foreground">
                {user.jobTitle}
              </p>
            ) : (
              <p className="text-secondary-foreground-500 text-balance lowercase tracking-tight text-lg max-w-md">
                This user has not provided job information.
              </p>
            )}
          </div>
        </div>
        <div>
          <WithAuth>
            {isOwnProfile ? (
              <EditProfileDialog user={user} />
            ) : (
              <FollowButton
                isFollowed={user.isFollowing}
                params={new Promise((res) => res({ userId: user.id }))}
              />
            )}
          </WithAuth>
        </div>
      </div>

      {/* Bio */}
      {user.bio && (
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p className="text-pretty leading-relaxed">{user.bio}</p>
        </div>
      )}

      {/* Contact & Social Media */}
      <div className="flex max-sm:flex-col flex-wrap gap-8">
        {user.email && (
          <div>
            <h3 className="text-sm font-semibold mb-2">Email</h3>
            <Link
              href={`mailto:${user.email}`}
              className="text-primary hover:underline flex items-center gap-2"
            >
              <Mail className="h-4 w-4" />
              {user.email}
            </Link>
          </div>
        )}
        {user.Social && (
          <div>
            <h3 className="text-sm font-semibold mb-2">Social Media</h3>
            <div className="flex gap-3">
              {Object.entries(user.Social).map(([name, url]) => {
                const Icon =
                  socialIcons[name as keyof typeof socialIcons] || Globe;
                return (
                  <Button
                    key={name}
                    size={"icon"}
                    variant={"outline"}
                    asChild={!!url}
                    disabled={!url}
                  >
                    <Link
                      key={name}
                      href={url}
                      target="_blank"
                      className="text-muted-foreground hover:text-accent transition-colors"
                    >
                      <Icon className="h-5 w-5" />
                    </Link>
                  </Button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
