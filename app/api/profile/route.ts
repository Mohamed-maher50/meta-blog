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
    const { user } = await requireAuth();
    const validationResult = updateUserSchema.parse(updatedValues);
    const updatedUser = await prisma.user.update({
      where: {
        id: user.userId,
      },
      data: validationResult,
      select: PRISMA_USER_INFO_FIELDS_SELECT,
    });
    return Response.json(updatedUser, { status: 200 });
  } catch (error) {
    return Response.json(...ErrorHandler(error, false));
  }
};

export const GET = async () => {
  try {
    const { user } = await requireAuth();
    const userData: User | null = await prisma.user.findUnique({
      where: {
        id: user.userId,
      },
    });
    if (userData) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...userWithoutPassword } = userData;
      return Response.json(userWithoutPassword, { status: 200 });
    }

    return Response.json(userData, { status: 200 });
  } catch (error) {
    return Response.json(...ErrorHandler(error, false));
  }
};
