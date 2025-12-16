import { auth } from "@/auth";
import { AppError, ErrorHandler } from "@/lib/GlobalErrorHandler";
import { prisma } from "@/prisma";
import { NextRequest } from "next/server";
import { z } from "zod";
const viewSchema = z.object({
  blogId: z.string(),
  visitor_ids: z.array(z.string()).min(1, "can't not find any ids for visitor"),
});

export const PATCH = async (
  req: NextRequest,
  { params }: { params: Promise<{ blogId: string }> }
) => {
  try {
    const { blogId } = await params;
    const data = await auth();

    const body = await req.json();
    const validationResult = viewSchema.parse({ ...body, blogId });
    const createdAt = new Date();
    const isBlogExist = await prisma.blog.findUnique({
      where: {
        id: validationResult.blogId,
      },
    });
    if (!isBlogExist)
      throw new AppError(
        `${blogId} not belong to blog maybe blog is deleted`,
        404
      );

    const existingVisit = await prisma.visitors.findFirst({
      where: {
        blogId: validationResult.blogId,
        OR: [{ visitorId: { in: validationResult.visitor_ids } }],
      },
    });

    if (existingVisit) return Response.json("already viewed", { status: 200 });

    if (data?.user.userId) validationResult.visitor_ids.push(data.user.userId);
    const uniqueVisitors = [...new Set(validationResult.visitor_ids)];
    const newVisitors = uniqueVisitors.map((v) => ({
      blogId: validationResult.blogId,
      visitorId: v,
      createdAt,
    }));

    await prisma.$transaction(async (tx) => {
      await tx.visitors.createMany({ data: newVisitors });
      const blogAfterUpdate = await tx.blog.update({
        where: { id: validationResult.blogId },
        data: { views_count: { increment: 1 } },
      });

      return blogAfterUpdate;
    }, {});

    return Response.json("submitted", { status: 201 });
  } catch (error) {
    return Response.json(...ErrorHandler(error, false));
  }
};
