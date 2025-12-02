import { auth } from "@/auth";
import { ErrorHandler } from "@/lib/GlobalErrorHandler";
import { ApiFutures } from "@/lib/utils";
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

  const apiFutures = new ApiFutures(req)
    .search({ label: "name" })
    .extractFields(["password", "isFirstVisit", "emailVerified"])
    .paginateQuery()
    .sortBy(["createdAt"])
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
    const { where, include } = apiFutures.Query;
    const user = await prisma.user.findUnique({
      where: {
        ...(where as Prisma.UserWhereUniqueInput),
      },
      ...(include && { include }),
    });
    return Response.json(user, { status: 200 });
  } catch (error) {
    return Response.json(...ErrorHandler(error, false));
  }
};
