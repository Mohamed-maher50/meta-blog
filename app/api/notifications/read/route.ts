import { ErrorHandler } from "@/lib/GlobalErrorHandler";
import { withAuth } from "@/lib/utils";
import { prisma } from "@/prisma";
import { z } from "zod";

const readNotificationsSchema = z.object({
  ids: z.array(z.string()),
});
export const PATCH = withAuth(async (req: Request, token) => {
  const body = await req.json();
  const validatedValues = readNotificationsSchema.parse(body);
  try {
    const newNotification = await prisma.notification.updateMany({
      where: {
        userId: token.userId,
        read: false,
        id: { in: validatedValues.ids },
      },
      data: {
        read: true,
      },
    });
    return Response.json(newNotification, { status: 200 });
  } catch (error) {
    return Response.json(...ErrorHandler(error, false));
  }
});
