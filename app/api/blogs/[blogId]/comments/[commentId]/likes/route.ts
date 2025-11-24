import { AppError, ErrorHandler } from "@/lib/GlobalErrorHandler";
import { requireAuth } from "@/lib/utils";
import { prisma } from "@/prisma";
import { NextResponse } from "next/server";
export const POST = async (
  req: Request,
  { params }: { params: Promise<{ commentId: string }> }
) => {
  try {
    const token = await requireAuth(req);
    const { commentId } = await params;

    const isLikedBefore = await prisma.commentLike.findFirst({
      where: {
        commentId: commentId,
        userId: token.userId,
      },
    });
    if (isLikedBefore)
      throw new AppError("You have already liked this comment", 400);

    const createdCommentLike = await prisma.commentLike.create({
      data: {
        commentId: commentId,
        userId: token.userId,
      },
    });

    return Response.json(createdCommentLike, { status: 201 });
  } catch (error) {
    return Response.json(...ErrorHandler(error, false));
  }
};

export const DELETE = async (
  req: Request,
  { params }: { params: Promise<{ commentId: string }> }
) => {
  try {
    const token = await requireAuth(req);
    const { commentId } = await params;

    await prisma.commentLike.deleteMany({
      where: {
        commentId: commentId,
        userId: token.userId,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return Response.json(...ErrorHandler(error, false));
  }
};
