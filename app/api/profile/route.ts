import { prisma } from "@/prisma";
import { User } from "@prisma/client";
import { PRISMA_USER_INFO_FIELDS_SELECT } from "../constants";
import { createUserSchema } from "@/schema/createUserSchema";
import { ErrorHandler } from "@/lib/GlobalErrorHandler";
import { requireAuth } from "@/lib/utils";
const updateUserSchema = createUserSchema.partial().omit({ email: true });
export const PUT = async (req: Request) => {
  try {
    const updatedValues = await req.json();
    const token = await requireAuth(req);
    const validationResult = updateUserSchema.parse(updatedValues);
    const updatedUser = await prisma.user.update({
      where: {
        id: token.userId,
      },
      data: validationResult,
      select: PRISMA_USER_INFO_FIELDS_SELECT,
    });
    return Response.json(updatedUser, { status: 200 });
  } catch (error) {
    return Response.json(...ErrorHandler(error, false));
  }
};

export const GET = async (req: Request) => {
  try {
    const token = await requireAuth(req);
    const user: User | null = await prisma.user.findUnique({
      where: {
        id: token.userId,
      },
    });
    if (user) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...userWithoutPassword } = user;
      return Response.json(userWithoutPassword, { status: 200 });
    }

    return Response.json(user, { status: 200 });
  } catch (error) {
    return Response.json(...ErrorHandler(error, false));
  }
};
