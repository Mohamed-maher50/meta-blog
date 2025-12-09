import { auth } from "@/auth";
import { ErrorHandler } from "@/lib/GlobalErrorHandler";
import { ApiFuturesQuery } from "@/lib/utils";
import { prisma } from "@/prisma";
import { Prisma } from "@prisma/client";

import { NextRequest } from "next/server";
const isFollowingQuery = (userId?: string) => {
  return {
    followers: {
      where: {
        followerId: userId,
      },
      select: {
        id: true,
      },
    },
  };
};
export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ userId?: string }> }
) => {
  const { userId } = await params;
  const session = await auth();
  const followStatusOperation = !!req.nextUrl.searchParams.get("status");
  const apiFutures = new ApiFuturesQuery(req)
    .search({ label: "name" })
    .omit(["password", "isFirstVisit", "emailVerified"])
    .paginateQuery()
    .sort(["createdAt"])
    .filter(["id", "label"], () => ({
      id: userId,
    }));
  if (followStatusOperation)
    apiFutures.Query.include = {
      ...apiFutures.Query.include,
      ...isFollowingQuery(session?.user?.userId),
    };
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  try {
    const { where, include, omit } = apiFutures.Query;
    const user = await prisma.user.findUnique({
      where: {
        ...(where as Prisma.UserWhereUniqueInput),
      },
      include: {
        ...include,
        followers: {
          where: {
            followerId: session?.user.userId,
          },
          select: { followerId: true },
        },
      },
      omit,
    });
    if (!user) return Response.json(user, { status: 200 });
    if (!followStatusOperation) return Response.json(user, { status: 200 });

    return Response.json(
      { ...user, isFollowing: user.followers.length > 0 },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(...ErrorHandler(error, false));
  }
};
