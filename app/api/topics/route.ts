import { ErrorHandler } from "@/lib/GlobalErrorHandler";
import { ApiFuturesQuery } from "@/lib/utils";
import { prisma } from "@/prisma";
import { createCategorySchema } from "@/schema/createCategorySchema";
import { NextRequest } from "next/server";
export const POST = async (req: Request) => {
  try {
    const body = await req.json();
    const validatedValues = createCategorySchema.parse(body);

    const topic = await prisma.topics.upsert({
      where: {
        label: validatedValues.label,
      },
      create: {
        label: validatedValues.label,
        topPosition: 1,
      },
      update: {
        topPosition: {
          increment: 1,
        },
      },
    });
    return Response.json(topic, { status: 201 });
  } catch (error) {
    return Response.json(...ErrorHandler(error, false));
  }
};
export const GET = async (req: NextRequest) => {
  try {
    const apiFutures = new ApiFuturesQuery(req)
      .search({ label: "label" })
      .omit()
      .paginateQuery()
      .sort(["createdAt", "topPosition", "numberOfFollowers"])
      .filter(["id", "label"]);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { skip, take, include, omit, ...countQuery } = apiFutures.Query;
    const numberOfTopics = await prisma.topics.count(countQuery);
    const pagination = apiFutures.paginate(numberOfTopics);

    const topics = await prisma.topics.findMany(apiFutures.Query);
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
