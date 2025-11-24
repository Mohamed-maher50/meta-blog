import { ErrorHandler } from "@/lib/GlobalErrorHandler";
import { ApiFutures } from "@/lib/utils";
import { prisma } from "@/prisma";
import { NextRequest } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const apiFutures = new ApiFutures(req)
      .extractFields()
      .paginateQuery()
      .sortBy(["createdAt"])
      .filter(["id", "followerId", "followeeId"]);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { skip, take, include, omit, ...countQuery } = apiFutures.Query;
    const numberOfTopics = await prisma.follow.count(countQuery);
    const pagination = apiFutures.paginate(numberOfTopics);
    const topics = await prisma.follow.findMany(apiFutures.Query);
    return Response.json({
      data: topics,
      pagination,
      success: true,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return Response.json(...ErrorHandler(error, false));
  }
};
