import { PRISMA_USER_INFO_FIELDS_SELECT } from "@/app/api/constants";
import { ApiFuturesQuery } from "@/lib/utils";
import { prisma } from "@/prisma";
import { NextRequest } from "next/server";

export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) => {
  try {
    const { userId } = await params;
    const apiFutures = new ApiFuturesQuery(req)
      .search({ label: "name" })
      .omit([])
      .paginateQuery()
      .sort(["createdAt"])
      .filter(["id", "topicId"], () => ({ userId }));
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { skip, take, include, omit, ...countQuery } = apiFutures.Query;
    const numberOfTopics = await prisma.followTopic.count(countQuery);
    const pagination = apiFutures.paginate(numberOfTopics);
    apiFutures.Query.include = {
      ...apiFutures.Query.include,
      topic: true,
      user: {
        select: PRISMA_USER_INFO_FIELDS_SELECT,
      },
    };
    const users = await prisma.followTopic.findMany(apiFutures.Query);
    return Response.json({
      data: users,
      pagination,
      success: true,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return Response.json(error, { status: 500 });
  }
};
