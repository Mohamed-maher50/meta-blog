import { pusherServer } from "@/lib/pusherClinet";
import { ApiFuturesQuery, requireAuth, withAuth } from "@/lib/utils";
import { newNotificationSchema } from "@/schema/NotificationsSchema";

import { NextRequest } from "next/server";
import {
  ACTION_NOTIFICATIONS_MESSAGES,
  PRISMA_USER_INFO_FIELDS_SELECT,
} from "../constants";
import { ErrorHandler } from "@/lib/GlobalErrorHandler";
import { prisma } from "@/prisma";

export const POST = withAuth(async (req: Request, token) => {
  const body = await req.json();
  const validationResult = newNotificationSchema.parse(body);
  try {
    const message =
      validationResult.message ||
      ACTION_NOTIFICATIONS_MESSAGES[validationResult.type];
    const newNotification = await prisma.notification.create({
      data: {
        message,
        userId: validationResult.userId,
        actorId: token.user.userId,
        type: validationResult.type,
        entityId: validationResult.entityId,
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
      newNotification
    );
    return Response.json(newNotification, { status: 200 });
  } catch (error) {
    return Response.json(...ErrorHandler(error, false));
  }
});

export const GET = async (req: NextRequest) => {
  try {
    const { user } = await requireAuth();

    const apiFutures = new ApiFuturesQuery(req)
      .search({ label: "message" })
      .sort(["createdAt"])
      .omit()
      .paginateQuery()
      .filter(["actorId", "type", "read", "userId"]);

    apiFutures.Query.where = {
      ...apiFutures.Query.where,
      userId: user.userId,
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { skip, take, include, omit, ...countQuery } = apiFutures.Query;
    const numberOfDocuments = await prisma.notification.count(countQuery);
    const pagination = apiFutures.paginate(numberOfDocuments);
    apiFutures.Query.include = {
      user: {
        select: PRISMA_USER_INFO_FIELDS_SELECT,
      },
      actor: {
        select: PRISMA_USER_INFO_FIELDS_SELECT,
      },
    };
    const notifications = await prisma.notification.findMany(apiFutures.Query);

    return Response.json({
      data: notifications,
      pagination,
      success: true,
      timestamp: new Date().toISOString(),
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return Response.json(...ErrorHandler(error, false));
  }
};
