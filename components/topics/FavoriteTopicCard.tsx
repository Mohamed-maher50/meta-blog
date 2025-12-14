"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, UserPlus, UserCheck } from "lucide-react";

import { useState } from "react";
import { Topics } from "@prisma/client";
export interface FavoriteTopicCardProps {
  topic: Topics & { id: string };
  isFollowing?: boolean;
}

export function FavoriteTopicCard({
  topic,
  isFollowing = false,
}: // onFollowToggle,
FavoriteTopicCardProps) {
  const [following, setFollowing] = useState(isFollowing);
  const [followerCount, setFollowerCount] = useState(topic.numberOfFollowers);

  const handleFollowClick = () => {
    const newFollowingState = !following;
    setFollowing(newFollowingState);
    setFollowerCount((prev) => (newFollowingState ? prev + 1 : prev - 1));
    // onFollowToggle?.(topic.id);
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:border-primary/50">
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                {topic.label}
              </h3>
              {topic.topPosition <= 10 && (
                <Badge variant="secondary" className="text-xs">
                  Top #{topic.topPosition}
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users size={16} />
              <span>{followerCount.toLocaleString()} followers</span>
            </div>
          </div>

          <Button
            size="sm"
            variant={following ? "outline" : "default"}
            className="shrink-0"
            onClick={handleFollowClick}
          >
            {following ? (
              <>
                <UserCheck size={16} className="mr-2" />
                Following
              </>
            ) : (
              <>
                <UserPlus size={16} className="mr-2" />
                Follow
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
