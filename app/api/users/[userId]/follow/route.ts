import { AppError, ErrorHandler } from "@/lib/GlobalErrorHandler";
import { pusherServer } from "@/lib/pusherClinet";
import { requireAuth } from "@/lib/utils";
import { prisma } from "@/prisma";

import { z } from "zod";
const followRequestSchema = z.object({
  userId: z.string().min(1),
});
export const POST = async (req: Request) => {
  try {
    const body = await req.json();
    const validationResult = followRequestSchema.parse(body);

    const { userId } = validationResult;
    const token = await requireAuth(req);
    const res = await prisma.follow.findFirst({
      where: {
        followerId: token.id,
        followeeId: userId,
      },
    });
    if (!res) throw new AppError("you already unfollowed", 400);

    await prisma.follow.delete({
      where: {
        id: res.id,
        followeeId: userId,
        followerId: token.userId,
      },
    });

    return Response.json({ message: "success deleted" }, { status: 200 });
  } catch (error) {
    return Response.json(...ErrorHandler(error, false));
  }
};
export const PATCH = async (
  req: Request,
  { params }: { params: Promise<{ userId: string }> }
) => {
  try {
    const token = await requireAuth(req);
    const param = await params;
    const validationResult = followRequestSchema.parse(param);
    await prisma.follow.create({
      data: {
        followeeId: validationResult.userId,
        followerId: token.userId,
      },
    });

    const notification = await prisma.notification.create({
      data: {
        actorId: token.userId,
        message: `started following you.`,
        userId: validationResult.userId,
        type: "FOLLOW",
        entityId: token.userId,
        read: false,
      },
      include: {
        actor: {
          select: {
            name: true,
            image: true,
            id: true,
            email: true,
          },
        },
        user: {
          select: { name: true, image: true, id: true, email: true },
        },
      },
    });

    await pusherServer.trigger(
      `private-user-${validationResult.userId}`,
      "new-notification",
      notification
    );

    return Response.json({ message: "success following" }, { status: 201 });
  } catch (error) {
    return Response.json(...ErrorHandler(error, false));
  }
};
export const DELETE = async (
  req: Request,
  { params }: { params: Promise<{ userId: string }> }
) => {
  try {
    const token = await requireAuth(req);
    const param = await params;
    const validationResult = followRequestSchema.parse(param);
    const { userId } = validationResult;
    await prisma.follow.deleteMany({
      where: {
        followeeId: userId,
        followerId: token.userId,
      },
    });
    return Response.json({ message: "success deleted" }, { status: 200 });
  } catch (error) {
    return Response.json(...ErrorHandler(error, false));
  }
};
