import { ErrorHandler } from "@/lib/GlobalErrorHandler";
import { ApiFuturesQuery } from "@/lib/utils";
import { prisma } from "@/prisma";
import { NextRequest } from "next/server";

export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ blogId: string }> }
) => {
  try {
    const { blogId } = await params;
    const apiFutures = new ApiFuturesQuery(req)
      .search({ label: "blogId" })
      .omit()
      .paginateQuery()
      .sort([])
      .filter(["id"], () => {
        return {
          blogId,
        };
      });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { skip, take, include, omit, ...countQuery } = apiFutures.Query;
    const numberOfTopics = await prisma.blogTopics.count(countQuery);
    const pagination = apiFutures.paginate(numberOfTopics);
    apiFutures.Query = {
      ...apiFutures.Query,
      include: {
        topic: true,
      },
      omit: {
        blogId: true,
        topicId: true,
      },
    };
    const topics = await prisma.blogTopics.findMany(apiFutures.Query);
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
