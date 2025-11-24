import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getTopics } from "@/lib/Topics";
import { RiFireFill } from "@remixicon/react";
import Link from "next/link";
import React from "react";

const DiscoverTopics = async () => {
  const { data: topics } = await getTopics(
    "limit=7&page=1&orderBy[]=-numberOfFollowers"
  );

  return (
    <div className="space-y-6 sticky max-md:w-full max-md:text-center duration-500 transition top-1 h-fit  w-72  md:w-92">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RiFireFill className="w-5 h-5 text-primary" />
            Popular Topics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className=" grid-cols-1 max-sm:grid-cols-2 gap-1.5 grid">
            {topics.map((topic) => (
              <Link
                href={`/topics/${topic.id}/`}
                key={topic.id}
                className="p-3  block w-full rounded-lg bg-secondary/50 hover:bg-secondary transition-colors cursor-pointer"
              >
                <p className="font-semibold text-foreground">{topic.label}</p>
                <p className="text-sm text-secondary-foreground">
                  {topic.numberOfFollowers >= 1000
                    ? (topic.numberOfFollowers / 1000).toFixed(1)
                    : topic.numberOfFollowers}{" "}
                  followers
                </p>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DiscoverTopics;
