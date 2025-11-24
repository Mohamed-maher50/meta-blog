import { followedTopics } from "@/lib/Topics";
import Link from "next/link";

import React from "react";

const TopicsFetcher = async ({
  userId,
  query,
}: {
  userId: string;
  query?: string;
}) => {
  const { data } = await followedTopics({ userId, query });
  return (
    <div className="grid-cols-2 sm:grid-cols-5  capitalize w-full grid  gap-1.5">
      {data.map((topic) => (
        <Link
          href={`/topics/${topic.id}/`}
          key={topic.id}
          className="p-3   block w-full rounded-lg bg-secondary/50 hover:bg-secondary transition-colors cursor-pointer"
        >
          <p className="font-semibold text-foreground">{topic.topic.label}</p>
          <p className="text-sm text-secondary-foreground">
            {topic.topic.numberOfFollowers >= 1000
              ? (topic.topic.numberOfFollowers / 1000).toFixed(1)
              : topic.topic.numberOfFollowers}{" "}
            followers
          </p>
        </Link>
      ))}
    </div>
  );
};

export default TopicsFetcher;
