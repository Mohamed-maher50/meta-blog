"use client";

import { useState } from "react";
import { Mail, Calendar } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { UserInfo } from "@/types";
import FollowButton from "../utils/FollowButton";
import WithAuth from "../auth/WithAuth";

interface UserCardProps {
  user: UserInfo & { isFollowing: boolean };
  variant?: "vertical" | "horizontal";
}

export default function UserCard({
  user,
  variant = "horizontal",
}: UserCardProps) {
  const [showFullBio, setShowFullBio] = useState(false);

  const formatJoinedDate = (dateString: Date) => {
    const date = new Date(dateString);
    return `Joined ${date.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    })}`;
  };

  const bioText = user.bio || "";
  const bioLines = bioText.split("\n");
  const shortBio = bioLines.slice(0, 1).join("\n");
  const hasMoreBio = bioLines.length > 1 || bioText.length > 200;

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const isVertical = variant === "vertical";

  return (
    <div
      className={`
        group relative overflow-hidden rounded-xl border border-border bg-card
        shadow-sm transition-all duration-300
        hover:shadow-lg hover:border-primary/20
        dark:hover:shadow-primary/5
        ${
          isVertical
            ? "flex flex-col items-center text-center p-6"
            : "md:flex md:flex-row md:items-start md:gap-6 p-6"
        }
      `}
    >
      <Link className="inset-0 absolute " href={`/author/${user.id}`}>
        <span className="sr-only">go to {user.name} profile page</span>
      </Link>
      {/* Profile Image */}
      <div className={`flex-shrink-0 ${isVertical ? "mb-4" : "md:mb-0"}`}>
        <Avatar className="h-24 w-24 ring-2 ring-border transition-all duration-300 group-hover:ring-primary/50">
          <AvatarImage src={user.image || "/placeholder.svg"} alt={user.name} />
          <AvatarFallback className="text-xl font-semibold">
            {getInitials(user.name)}
          </AvatarFallback>
        </Avatar>
      </div>

      {/* User Info */}
      <div className={`flex-1 space-y-3 ${isVertical ? "w-full" : ""}`}>
        {/* Name and Job Title */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground transition-colors group-hover:text-primary">
              {user.name}
            </h2>
            <p className="text-sm font-medium text-muted-foreground mt-1">
              {user.jobTitle || "Web Developer"}
            </p>
          </div>
          <WithAuth>
            <div className="relative z-10" onClick={(e) => e.stopPropagation()}>
              <FollowButton
                isFollowed={user.isFollowing}
                params={new Promise((res) => res({ userId: user.id }))}
              />
            </div>
          </WithAuth>
        </div>

        {/* Bio */}
        <div className="text-sm text-foreground/80 leading-relaxed">
          <p className="whitespace-pre-line">
            {showFullBio ? user.bio : shortBio}
            {hasMoreBio && !showFullBio && "..."}
          </p>
          {hasMoreBio && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowFullBio(!showFullBio);
              }}
              className="text-primary z-10 relative hover:text-primary/80 font-medium mt-2 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 rounded px-1"
            >
              {showFullBio ? "Show less" : "Show more"}
            </button>
          )}
        </div>

        {/* Contact Info */}
        <div className="flex flex-wrap gap-4 text-sm">
          <a
            href={`mailto:${user.email}`}
            className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 rounded px-1"
          >
            <Mail className="h-4 w-4" />
            <span>{user.email}</span>
          </a>

          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{formatJoinedDate(user.createdAt)}</span>
          </div>
        </div>

        {/* Social Media */}
        {user.Social && (
          <div className="flex gap-2 pt-2">
            {Object.entries(user.Social).map(([key, value], index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                asChild
                className="hover:bg-primary hover:text-primary-foreground transition-colors bg-transparent"
              >
                <a href={value} target="_blank" rel="noopener noreferrer">
                  {key}
                </a>
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
