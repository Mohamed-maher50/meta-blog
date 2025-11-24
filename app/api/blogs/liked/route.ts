import { ErrorHandler } from "@/lib/GlobalErrorHandler";
import { requireAuth } from "@/lib/utils";
import { prisma } from "@/prisma";
import { userLikedBlogSchema } from "@/schema/UserLikedBlogs";

import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const token = await requireAuth(req);

    const data = await req.json();
    const validationResult = userLikedBlogSchema.parse(data);

    const isLikedBefore = await prisma.blogLike.findFirst({
      where: {
        blogId: validationResult.blogId,
        userId: token.userId,
      },
    });

    if (isLikedBefore) {
      await prisma.blogLike.delete({ where: { id: isLikedBefore.id } });
      return NextResponse.json("deleted successfully", { status: 200 });
    } else {
      const liked = await prisma.blogLike.create({
        data: { blogId: validationResult.blogId, userId: token.userId },
      });
      return NextResponse.json(liked, { status: 201 });
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return Response.json(...ErrorHandler(error, false));
  }
};
