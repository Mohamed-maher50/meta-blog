import { AppError, ErrorHandler } from "@/lib/GlobalErrorHandler";
import { prisma } from "@/prisma";
import { newSubscriptionSchema } from "@/schema/SubscriptionSchema";

export const POST = async (req: Request) => {
  const body = await req.json();

  try {
    const data = newSubscriptionSchema.parse(body);
    const isSubscribed = await prisma.subscriptions.findUnique({
      where: data,
    });
    if (isSubscribed) throw new AppError("subscribed before", 403);
    const subscription = await prisma.subscriptions.create({
      data,
    });
    return Response.json(subscription, { status: 201 });
  } catch (error) {
    return Response.json(...ErrorHandler(error, false));
  }
};
