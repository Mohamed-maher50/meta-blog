import { ErrorHandler } from "@/lib/GlobalErrorHandler";
import { requireAuth } from "@/lib/utils";
import { prisma } from "@/prisma";
import { ChooseTopicsSchema } from "@/schema/UserTopicsSchema";

export const POST = async (req: Request) => {
  try {
    const body = await req.json();
    const validationResult = ChooseTopicsSchema.parse(body);
    const { user } = await requireAuth();
    const UserTopics = await prisma.userTopic.createMany({
      data: validationResult.topics.map((tpc) => ({
        topicId: tpc,
        userId: user.userId,
      })),
    });
    await prisma.user.update({
      where: {
        id: user.userId,
      },
      data: {
        isFirstVisit: false,
      },
    });
    return Response.json(UserTopics, { status: 200 });
  } catch (error) {
    return Response.json(...ErrorHandler(error));
  }
};
