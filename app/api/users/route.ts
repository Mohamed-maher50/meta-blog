import { ErrorHandler } from "@/lib/GlobalErrorHandler";
import { ApiFutures } from "@/lib/utils";
import { prisma } from "@/prisma";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    const apiFutures = new ApiFutures(req)
      .search({ label: "name" })
      .extractFields(["password", "isFirstVisit", "emailVerified"])
      .paginateQuery()
      .sortBy(["createdAt"])
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
            followerId: token?.userId,
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
