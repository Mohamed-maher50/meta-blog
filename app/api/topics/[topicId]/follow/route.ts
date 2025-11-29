import { ErrorHandler } from "@/lib/GlobalErrorHandler";
import { requireAuth } from "@/lib/utils";
import { prisma } from "@/prisma";
import { NextResponse } from "next/server";

export const POST = async (
  req: Request,
  {
    params,
  }: {
    params: Promise<{
      topicId: string;
    }>;
  }
) => {
  try {
    const { topicId } = await params;

    const { user } = await requireAuth();
    const res = await prisma.followTopic.findFirst({
      where: {
        userId: user.userId,
        topicId,
      },
    });
    if (res)
      return Response.json(
        { message: "you already following this topic" },
        { status: 403 }
      );
    const createdFollowing = await prisma.followTopic.create({
      data: {
        userId: user.userId,
        topicId,
      },
    });
    return Response.json(
      {
        data: createdFollowing,
        success: true,
        timestamp: new Date().toISOString(),
      },
      { status: 201 }
    );
  } catch (error) {
    return Response.json(...ErrorHandler(error, false));
  }
};

export const DELETE = async (
  req: Request,
  { params }: { params: Promise<{ topicId: string }> }
) => {
  try {
    const { user } = await requireAuth();
    const { topicId } = await params;

    await prisma.followTopic.deleteMany({
      where: {
        topicId,
        userId: user.userId,
      },
    });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return Response.json(...ErrorHandler(error, false));
  }
};
