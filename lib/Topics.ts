import { Topics } from "@prisma/client";
import { ExtendingError } from "./utils";
import { _Count, ExpendedUserTopic, ResponseSuccess } from "@/types";

export const getTopics = async (
  query?: string
): Promise<ResponseSuccess<Topics[]>> => {
  const queryTrimmed = query ? `?${query}` : "";
  const topicsResponse = await fetch(
    `http://localhost:3000/api/topics${queryTrimmed}`
  );
  if (!topicsResponse.ok) new ExtendingError(`con't get topics`, "500");
  return await topicsResponse.json();
};

type getTopicByIdI = Omit<
  ResponseSuccess<_Count<Topics, "followers" | "BlogTopics">>,
  "pagination"
>;
export const getTopicById = async (query?: string): Promise<getTopicByIdI> => {
  const queryTrimmed = query ? `${query}` : "";
  const topicsResponse = await fetch(
    `http://localhost:3000/api/topics/${queryTrimmed}`
  );
  if (!topicsResponse.ok) new ExtendingError(`con't get topics`, "500");
  return await topicsResponse.json();
};
export const followedTopics = async ({
  userId,
  query,
}: {
  userId: string;
  query?: string;
}): Promise<
  ResponseSuccess<Omit<ExpendedUserTopic, "user" | "userId" | "topicId">[]>
> => {
  const topicsResponse = await fetch(
    `http://localhost:3000/api/users/${userId}/followed-topics${
      query ? `?${query}` : ""
    }`
  );
  if (!topicsResponse.ok) new ExtendingError(`con't get topics`, "500");
  return await topicsResponse.json();
};
