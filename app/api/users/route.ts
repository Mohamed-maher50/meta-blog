import { auth } from "@/auth";
import { ErrorHandler } from "@/lib/GlobalErrorHandler";
import { ApiFuturesQuery } from "@/lib/utils";
import { prisma } from "@/prisma";

import { NextRequest } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const session = await auth();

    const apiFutures = new ApiFuturesQuery(req)
      .search({ label: "name" })
      .omit(["password", "isFirstVisit", "emailVerified"])
      .paginateQuery()
      .sort(["createdAt"])
      .filter(["id", "label"]);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { skip, take, include, omit, ...countQuery } = apiFutures.Query;
    const numberOfTopics = await prisma.user.count(countQuery);
    const pagination = apiFutures.paginate(numberOfTopics);
    const users = await prisma.user.findMany({
      ...apiFutures.Query,
      include: {
        ...apiFutures.Query.include,

        followers: {
          where: {
            followerId: session?.user?.userId,
          },
          select: {
            id: true,
          },
        },
      },
    });
    const usersAfterAddIsFollowing = users.map((t) => {
      if (t.followers && t.followers.length) return { ...t, isFollowing: true };
      return { ...t, isFollowing: false };
    });
    return Response.json({
      data: usersAfterAddIsFollowing,
      pagination,
      success: true,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return Response.json(...ErrorHandler(error, false));
  }
};
