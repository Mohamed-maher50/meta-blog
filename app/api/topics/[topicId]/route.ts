import { ErrorHandler } from "@/lib/GlobalErrorHandler";
import { ApiFuturesQuery } from "@/lib/utils";
import { prisma } from "@/prisma";
import { NextRequest } from "next/server";

export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ topicId: string }> }
) => {
  try {
    const { topicId } = await params;
    const apiFutures = new ApiFuturesQuery(req)
      .omit()
      .filter(["id", "label"]);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { where, take, skip, orderBy, ...query } = apiFutures.Query;

    const topics = await prisma.topics.findUnique({
      where: { id: topicId },
      include: {
        _count: {
          select: {
            followers: true,
            BlogTopics: true,
          },
        },
      },
    });
    return Response.json({
      data: topics,
      success: true,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return Response.json(...ErrorHandler(error, false));
  }
};
