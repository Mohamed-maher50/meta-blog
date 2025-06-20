import { prisma } from "@/prisma";
import { User } from "@prisma/client";

export const GET = async (
  req: Request,
  { params }: { params: Promise<{ userId: string }> }
) => {
  const { userId } = await params;
  try {
    const user: User | null = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (user) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...userWithoutPassword } = user;
      return Response.json(userWithoutPassword, { status: 200 });
    }

    return Response.json(user, { status: 200 });
  } catch (error) {
    return Response.json(error, { status: 500 });
  }
};
